/**
 * Lógica de Arquitectura Humanage 
 * Mrebori
 */

// 1. Manejo de la explicación de Nómina
function toggleNominaExplicacion(show) {
    const box = document.getElementById('boxNominaExplicacion');
    if (box) box.style.display = show ? 'block' : 'none';
}

// 2. Mostrar/Ocultar elementos genéricos
function toggleElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    }
}

// 3. Generación Dinámica de Filas (Limpia sin columna de Logo)
function generarFilasTabla() {
    const cantElem = document.getElementById('cantEmpresas');
    const tbody = document.getElementById('cuerpoTablaRS');
    if (!cantElem || !tbody) return;
    
    const cantidad = cantElem.value;
    tbody.innerHTML = ''; 

    for (let i = 1; i <= cantidad; i++) {
        const fila = `
            <tr>
                <td>${i}</td>
                <td><input type="text" name="rs${i}" placeholder="Ej: Empresa S.A." required></td>
                <td>
                    <input type="text" name="cuit${i}" 
                           placeholder="30-12345678-9" 
                           pattern="^(30|33|34)-[0-9]{8}-[0-9]$" 
                           title="Debe ser un CUIT válido" required>
                </td>
                <td><input type="number" name="cant${i}" placeholder="150" required></td>
            </tr>`;
        tbody.innerHTML += fila;
    }
}

// 4. Lógica de Firmas y Submenús
function checkFirmas() {
    const fEmpleado = document.getElementById('firmaEmpleado').value;
    const fApoderado = document.getElementById('firmaApoderado').value;
    const boxProveedor = document.getElementById('boxProveedor');
    const boxComportamiento = document.getElementById('boxComportamiento');

    const usaDigital = (fEmpleado.includes('digital') || fEmpleado === 'ambas' || fApoderado.includes('digital') || fApoderado === 'ambas');
    if (boxProveedor) boxProveedor.style.display = usaDigital ? 'block' : 'none';

    const usaElectronica = (fEmpleado === 'electronica' || fEmpleado === 'ambas');
    if (boxComportamiento) boxComportamiento.style.display = usaElectronica ? 'block' : 'none';
}

// 5. Envío del Formulario Estructurado
async function enviarFormulario(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('deliveryForm');
    const btnSubmit = form.querySelector('.btn-submit');
    const formData = new FormData(form);
    
    const logoGlobalSelector = document.getElementById('requiereLogoGlobal');
    const requiereLogoGlobal = logoGlobalSelector ? logoGlobalSelector.value : null;
    const inputLogos = document.getElementById('logosEmpresa');

    const algunaRSconLogo = Array.from(formData.entries()).some(([key, value]) => key.startsWith('logo') && value === 'si');
    const validacionLogoCargado = (requiereLogoGlobal === 'si' || algunaRSconLogo);

    if (validacionLogoCargado && (!inputLogos || inputLogos.files.length === 0)) {
        alert("⚠️ Atención: Se requiere al menos un archivo de Logo para continuar.");
        return;
    }

    const fileInput = document.getElementById('ejemplosPDF');
    const nombresPDFs = fileInput ? Array.from(fileInput.files).map(f => f.name) : [];
    const nombresLogos = inputLogos ? Array.from(inputLogos.files).map(f => f.name) : [];
    const totalArchivos = [...nombresPDFs, ...nombresLogos];

    const inputEtiquetas = document.getElementById('archivoEtiquetas');
    const refEtiquetas = inputEtiquetas?.files[0] ? inputEtiquetas.files[0].name : "Sin archivo adjunto";

    const payload = {
        metadata: {
            fecha_relevamiento: new Date().toISOString(),
            version_wizard: "1.3",
            arquitecto: "Rebori Marcelo"
        },
        responsable: {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('correo').value,
            empresa_grupo: document.getElementById('empresaGrupo').value 
        },
        configuracion_tecnica: {
            firma_empleado: document.getElementById('firmaEmpleado').value,
            firma_apoderado: document.getElementById('firmaApoderado').value,
            preferencia_firma_empleado: document.querySelector('select[name="preferenciaFirma"]')?.value || "n/a",
            proveedor_digital: document.querySelector('select[name="proveedorDigital"]')?.value || "no aplica",
            confirmacion_husigner_it: document.getElementById('checkIT')?.checked || false,
            nomina_confidencial: formData.get('confidencial') === 'si',
            archivo_etiquetas_referencia: refEtiquetas,
            lleva_logo_global: requiereLogoGlobal 
        },
        archivos_adjuntos_nombres: totalArchivos, 
        entidades: [],
        liquidaciones_seleccionadas: []
    };

    const totalRS = document.getElementById('cantEmpresas').value;
    for (let i = 1; i <= totalRS; i++) {
        payload.entidades.push({
            id: i,
            razon_social: formData.get(`rs${i}`),
            cuit: formData.get(`cuit${i}`),
            dotacion: formData.get(`cant${i}`),
            lleva_logo: requiereLogoGlobal !== null ? requiereLogoGlobal : formData.get(`logo${i}`)
        });
    }

    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]:checked');
    checkboxes.forEach(cb => payload.liquidaciones_seleccionadas.push(cb.parentElement.innerText.trim()));

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Procesando...";

    try {
        const response = await fetch('http://localhost:5094/api/relevamiento', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("¡Éxito! Registro guardado en HumanageDB.");
            form.reset();
            generarFilasTabla(); 
        } else {
            alert("Error en el servidor.");
        }
    } catch (error) {
        alert("Error de conexión: El motor .NET está apagado.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Finalizar";
    }
}

// 7. Función verDetalle con Diseño de Arquitecto e Interactividad de Descarga
function verDetalle(index) {
    const data = relevamientosCache[index];
    if (!data) return;

    const modal = document.getElementById('modalDetalle');
    const cont = document.getElementById('det_contenido');
    
    const nombreGrupoDetalle = data.responsable?.empresa_grupo || "Detalle de Configuración";
    document.getElementById('det_titulo').innerText = nombreGrupoDetalle;

    const refEtiquetas = data.configuracion_tecnica?.archivo_etiquetas_referencia || "No adjunto";
    const archivos = data.archivos_adjuntos_nombres || [];

    cont.innerHTML = `
        <div class="info-grid">
            <div class="card-detalle">
                <h3>⚙️ Configuración Técnica</h3>
                <p><strong>Firma Empleado:</strong> ${data.configuracion_tecnica?.firma_empleado?.toUpperCase() || 'N/A'}</p>
                <p><strong>Proveedor:</strong> <span class="status-badge" style="background:#e8f5e9">${data.configuracion_tecnica?.proveedor_digital || 'no aplica'}</span></p>
                <p><strong>Nómina Confidencial:</strong> ${data.configuracion_tecnica?.nomina_confidencial ? '✅ Sí' : '❌ No'}</p>
                <p><strong>Confirmación IT:</strong> ${data.configuracion_tecnica?.confirmacion_husigner_it ? '✅ Confirmado' : '⏳ Pendiente'}</p>
            </div>

            <div class="card-detalle" style="border-left: 4px solid #217346;">
                <h3>📊 Activos y Referencias</h3>
                
                <div style="background: #f4fbf7; border: 1px solid #c3e6cb; padding: 12px; border-radius: 8px; margin-bottom: 15px; cursor: pointer; transition: 0.2s;" 
                     onclick="descargarActivo('${refEtiquetas}')" onmouseover="this.style.background='#e2f3e7'" onmouseout="this.style.background='#f4fbf7'">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: #217346; color: white; padding: 5px 8px; border-radius: 4px; font-weight: bold; font-size: 0.7em;">XLSX</div>
                        <div>
                            <p style="margin:0; font-size: 0.75em; color: #155724; font-weight: bold; text-transform: uppercase;">Descargar Planilla Etiquetas:</p>
                            <p style="margin:0; font-family: monospace; color: #333; font-size: 0.9em;">${refEtiquetas}</p>
                        </div>
                        <span style="margin-left: auto;">📥</span>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${archivos.map(arc => {
                        const isLogo = arc.toLowerCase().includes('logo');
                        const style = isLogo ? 'background:#fff9c4; border-color:#fbc02d; color:#856404;' : 'background:#e3f2fd; border-color:#bbdefb; color:#004085;';
                        return `
                        <div class="tag-item" 
                             onclick="descargarActivo('${arc}')"
                             style="${style} padding: 6px 10px; font-size: 0.8em; border: 1px solid; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                            ${isLogo ? '🎨' : '📄'} ${arc} <span style="font-size: 0.9em;">📥</span>
                        </div>`;
                    }).join('') || '<p>Sin adjuntos</p>'}
                </div>
            </div>

            <div class="card-detalle">
                <h3>🏢 Entidades (${data.entidades?.length || 0})</h3>
                <div style="max-height: 150px; overflow-y: auto;">
                    ${(data.entidades || []).map(ent => `
                        <div style="padding: 5px 0; border-bottom: 1px solid #eee; font-size: 0.9em;">
                            <strong>${ent.razon_social}</strong> ${ent.lleva_logo === 'si' ? '🖼️' : ''}<br>
                            <small>CUIT: ${ent.cuit} | Dot: ${ent.dotacion}</small>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card-detalle">
                <h3>📋 Liquidaciones</h3>
                <div class="tag-list">
                    ${(data.liquidaciones_seleccionadas || []).map(liq => `<span class="tag-item" style="background: #f0f0f0; padding: 2px 8px; border-radius: 10px; margin: 2px; font-size: 0.85em; display: inline-block;">${liq}</span>`).join('')}
                </div>
            </div>
        </div>
        <div style="margin-top:20px; border-top: 1px solid #eee; padding-top:10px;">
             <details>
                <summary style="cursor:pointer; color: #666; font-size: 0.8em;">Ver Auditoría JSON</summary>
                <pre class="json-raw" style="background:#222; color:#0f0; padding:10px; border-radius:5px; font-size:0.8em; margin-top:5px;">${JSON.stringify(data, null, 4)}</pre>
            </details>
        </div>
    `;
    modal.style.display = "block";
}

// 8. Lógica de Descarga (Preparada para Azure)
function descargarActivo(nombreArchivo) {
    if (!nombreArchivo || nombreArchivo.includes("Sin archivo") || nombreArchivo.includes("No adjunto")) {
        alert("⚠️ No hay un archivo físico vinculado a este registro.");
        return;
    }
    
    // Simulación de descarga - Aquí irá la URL de Azure Blob Storage
    console.log("Solicitando activo: " + nombreArchivo);
    alert("🚀 Iniciando descarga del activo:\n" + nombreArchivo + "\n\n(Estado: Esperando configuración de Azure Blob Storage)");
}

// 6. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cantEmpresas')) generarFilasTabla();
    if (document.getElementById('firmaEmpleado')) checkFirmas();

    const form = document.getElementById('deliveryForm');
    if (form) form.addEventListener('submit', enviarFormulario);

    const logoGlobal = document.getElementById('requiereLogoGlobal');
    if (logoGlobal) {
        logoGlobal.addEventListener('change', function() {
            const cont = document.getElementById('contenedorInputLogo');
            if (cont) cont.style.display = this.value === 'si' ? 'block' : 'none';
        });
    }
});
