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
// Esta función construye la tabla según la cantidad de empresas seleccionadas
function generarFilasTabla() {
    const cantidad = document.getElementById('cantEmpresas').value;
    const tbody = document.getElementById('cuerpoTablaRS');
    
    if (!tbody) return;

    tbody.innerHTML = ''; // Limpiamos la tabla

    for (let i = 1; i <= cantidad; i++) {
        const fila = `
            <tr>
                <td>${i}</td>
                <td>
                    <input type="text" name="rs${i}" placeholder="Ej: Empresa S.A." required>
                </td>
                <td>
                    <input type="text" name="cuit${i}" 
                           placeholder="30-12345678-9" 
                           pattern="^(30|33|34)-[0-9]{8}-[0-9]$" 
                           title="Debe ser un CUIT válido (30, 33 o 34)" 
                           required>
                </td>
                <td>
                    <input type="number" name="cant${i}" placeholder="150" required>
                </td>
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
        boxProveedor.style.display = 'block';
    } else {
        boxProveedor.style.display = 'none';
    }

    if (fEmpleado === 'electronica' || fEmpleado === 'ambas') {
        boxComportamiento.style.display = 'block';
    } else {
        boxComportamiento.style.display = 'none';
    }
}

// 5. Envío del Formulario Estructurado (Mapeo Profesional)
function enviarFormulario(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('deliveryForm');
    const formData = new FormData(form);
    
    // 1. Capturamos datos básicos del Responsable
    const payload = {
        metadata: {
            fecha_relevamiento: new Date().toISOString(),
            version_wizard: "1.2"
        },
        responsable: {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('correo').value,
            empresa_grupo: document.getElementById('empresa').value
        },
        configuracion_tecnica: {
            firma_empleado: document.getElementById('firmaEmpleado').value,
            firma_apoderado: document.getElementById('firmaApoderado').value,
            requiere_husigner: document.getElementById('checkIT').checked,
            nomina_confidencial: formData.get('confidencial') === 'si'
        },
        entidades: [], // Aquí irán las N razones sociales
        liquidaciones_seleccionadas: []
    };

    // 2. Mapeo dinámico de Razones Sociales
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

    // 3. Captura de Checkboxes (Tipos de liquidación)
    // Buscamos todos los checkboxes marcados en el paso 5
    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
        payload.liquidaciones_seleccionadas.push(cb.parentElement.textContent.trim());
    });

    // log de seguridad para Marcelo
    console.log("--- OBJETO LISTO PARA API (JSON) ---");
    console.log(payload);

    // 4. Feedback visual
    alert("Marcelo, el relevamiento se ha estructurado correctamente.\n\nSe han procesado " + totalRS + " empresas y " + payload.liquidaciones_seleccionadas.length + " tipos de liquidación.");
}
// 6. Inicialización de estados al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Generamos la tabla inicial (1 empresa)
    if (document.getElementById('cantEmpresas')) {
        generarFilasTabla();
    }

    // Verificamos firmas
    if (document.getElementById('firmaEmpleado')) {
        checkFirmas();
    }

    // Escuchamos el evento submit del formulario
    const form = document.getElementById('deliveryForm');
    if (form) {
        form.addEventListener('submit', enviarFormulario);
    }
});
