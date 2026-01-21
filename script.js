/**
 * Lógica de Arquitectura Humanage 
 * Mrebori
 */

// 1. Manejo de la explicación de Nómina (Paso 3)
function toggleNominaExplicacion(show) {
    const box = document.getElementById('boxNominaExplicacion');
    if (box) {
        box.style.display = show ? 'block' : 'none';
    }
}

// 2. Mostrar/Ocultar ejemplo de tabla Excel (Paso 3)
function toggleElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    }
}

// 3. Generación Dinámica de Filas (Paso 2)
function generarFilasTabla() {
    const cantElem = document.getElementById('cantEmpresas');
    if (!cantElem) return;
    
    const cantidad = cantElem.value;
    const tbody = document.getElementById('cuerpoTablaRS');
    if (!tbody) return;

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
                           title="Debe ser un CUIT válido (30, 33 o 34)" 
                           required>
                </td>
                <td><input type="number" name="cant${i}" placeholder="150" required></td>
                <td>
                    <select class="styled-select" name="logo${i}">
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                    </select>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    }
}

// 4. Lógica de Firmas y Submenús (Paso 4)
function checkFirmas() {
    const fEmpleado = document.getElementById('firmaEmpleado').value;
    const fApoderado = document.getElementById('firmaApoderado').value;
    
    const boxProveedor = document.getElementById('boxProveedor');
    const boxComportamiento = document.getElementById('boxComportamiento');

    if (fEmpleado === 'digital' || fEmpleado === 'ambas' || fApoderado === 'digital' || fApoderado === 'ambas') {
        if (boxProveedor) boxProveedor.style.display = 'block';
    } else {
        if (boxProveedor) boxProveedor.style.display = 'none';
    }

    if (fEmpleado === 'electronica' || fEmpleado === 'ambas') {
        if (boxComportamiento) boxComportamiento.style.display = 'block';
    } else {
        if (boxComportamiento) boxComportamiento.style.display = 'none';
    }
}

// 5. Envío del Formulario Estructurado (Mapeo y Validaciones)
async function enviarFormulario(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('deliveryForm');
    const btnSubmit = form.querySelector('.btn-submit');
    const formData = new FormData(form);
    
    // --- VALIDACIONES TÉCNICAS ---
    const fEmpleado = document.getElementById('firmaEmpleado').value;
    const fApoderado = document.getElementById('firmaApoderado').value;
    const proveedor = document.querySelector('select[name="proveedorDigital"]')?.value;

    if ((fEmpleado.includes('digital') || fApoderado.includes('digital')) && (!proveedor || proveedor === "")) {
        alert("⚠️ Atención: Debe seleccionar un proveedor de certificado (Lakaut/Encode) para continuar.");
        return;
    }

    const valoresTabla = Array.from(formData.entries());
    const llevaLogo = valoresTabla.some(([key, value]) => key.startsWith('logo') && value === 'si');
    const inputLogos = document.getElementById('logosEmpresa');

    if (llevaLogo && inputLogos && inputLogos.files.length === 0) {
        alert("⚠️ Atención: Indicó que una entidad lleva logo, pero no ha adjuntado archivos en el Paso 6.");
        return;
    }

    // --- PREPARACIÓN DE PAYLOAD (Alineado con Dashboard) ---
    const fileInput = document.getElementById('ejemplosPDF');
    const nombresArchivos = fileInput ? Array.from(fileInput.files).map(f => f.name) : [];
    
    const inputEtiquetas = document.getElementById('archivoEtiquetas');
    const refEtiquetas = inputEtiquetas?.files[0] ? inputEtiquetas.files[0].name : "Sin archivo adjunto";

    const payload = {
        metadata: {
            fecha_relevamiento: new Date().toISOString(),
            version_wizard: "1.2",
            arquitecto: "Vans - Rebori Marcelo"
        },
        responsable: {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('correo').value,
            empresa_grupo: document.getElementById('empresa').value
        },
        configuracion_tecnica: {
            firma_empleado: fEmpleado,
            firma_apoderado: fApoderado,
            preferencia_firma_empleado: document.querySelector('select[name="preferenciaFirma"]')?.value || "n/a",
            proveedor_digital: proveedor || "no aplica",
            confirmacion_husigner_it: document.getElementById('checkIT')?.checked || false,
            nomina_confidencial: formData.get('confidencial') === 'si',
            archivo_etiquetas_referencia: refEtiquetas
        },
        archivos_adjuntos_nombres: nombresArchivos, 
        entidades: [],
        liquidaciones_seleccionadas: []
    };

    // Mapeo de Entidades
    const totalRS = document.getElementById('cantEmpresas').value;
    for (let i = 1; i <= totalRS; i++) {
        payload.entidades.push({
            id: i,
            razon_social: formData.get(`rs${i}`),
            cuit: formData.get(`cuit${i}`),
            dotacion: formData.get(`cant${i}`),
            lleva_logo: formData.get(`logo${i}`)
        });
    }

    // Mapeo de Liquidaciones (Limpia el texto del label)
    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
        const texto = cb.parentElement.innerText.trim();
        payload.liquidaciones_seleccionadas.push(texto);
    });

    // --- PROCESO DE ENVÍO ---
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Procesando...";

    try {
        const response = await fetch('http://localhost:5094/api/relevamiento', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("¡Éxito! El relevamiento ha sido guardado y ya está disponible en el Dashboard.");
            form.reset();
            generarFilasTabla(); 
        } else {
            alert("Error en el servidor. Revisa la consola de .NET.");
        }
    } catch (error) {
        console.error("Error crítico:", error);
        alert("Error de conexión: El motor .NET está apagado.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Finalizar Relevamiento";
    }
}

// 6. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cantEmpresas')) generarFilasTabla();
    if (document.getElementById('firmaEmpleado')) checkFirmas();

    const form = document.getElementById('deliveryForm');
    if (form) form.addEventListener('submit', enviarFormulario);
});
