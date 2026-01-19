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

// 4. Lógica de Firmas y Submenús (Paso 4) - CORREGIDO
function checkFirmas() {
    const fEmpleado = document.getElementById('firmaEmpleado').value;
    const fApoderado = document.getElementById('firmaApoderado').value;
    
    const boxProveedor = document.getElementById('boxProveedor');
    const boxComportamiento = document.getElementById('boxComportamiento');

    // Lógica para mostrar caja de proveedor (Lakaut/Encode)
    if (fEmpleado === 'digital' || fEmpleado === 'ambas' || fApoderado === 'digital' || fApoderado === 'ambas') {
        boxProveedor.style.display = 'block';
    } else {
        boxProveedor.style.display = 'none';
    }

    // Lógica para mostrar comportamiento de firma (Masiva/Antiguo)
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
            // Validación de seguridad: si no existe el checkbox en pantalla, es false
            requiere_husigner: document.getElementById('checkIT') ? document.getElementById('checkIT').checked : false,
            nomina_confidencial: formData.get('confidencial') === 'si'
        },
        entidades: [],
        liquidaciones_seleccionadas: []
    };

    // Mapeo dinámico de Razones Sociales
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

    // Captura de Checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
        payload.liquidaciones_seleccionadas.push(cb.parentElement.textContent.trim());
    });

    console.log("--- OBJETO LISTO PARA API (JSON) ---");
    console.log(payload);

    alert("El relevamiento se ha estructurado correctamente.\n\nDatos listos en consola para el equipo de Desarrollo.");
}

// 6. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cantEmpresas')) generarFilasTabla();
    if (document.getElementById('firmaEmpleado')) checkFirmas();

    const form = document.getElementById('deliveryForm');
    if (form) form.addEventListener('submit', enviarFormulario);
});
