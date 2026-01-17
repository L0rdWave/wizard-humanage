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

// 3. Lógica de Firmas y Submenús (Paso 4)
function checkFirmas() {
    const fEmpleado = document.getElementById('firmaEmpleado').value;
    const fApoderado = document.getElementById('firmaApoderado').value;
    
    const boxProveedor = document.getElementById('boxProveedor');
    const boxComportamiento = document.getElementById('boxComportamiento');

    // Mostrar Proveedor si alguno tiene Digital o Ambas
    if (fEmpleado === 'digital' || fEmpleado === 'ambas' || fApoderado === 'digital' || fApoderado === 'ambas') {
        boxProveedor.style.display = 'block';
    } else {
        boxProveedor.style.display = 'none';
    }

    // Mostrar Comportamiento (Masiva/Antiguo) solo si el Empleado tiene Electrónica o Ambas
    if (fEmpleado === 'electronica' || fEmpleado === 'ambas') {
        boxComportamiento.style.display = 'block';
    } else {
        boxComportamiento.style.display = 'none';
    }
}

// 4. Envío del Formulario
function enviarFormulario() {
    alert("Vans, la estructura de HumanaGE ha sido configurada siguiendo tus lineamientos.");
    
    const form = document.getElementById('deliveryForm');
    const datos = new FormData(form);
    
    console.log("Datos listos para la realidad:");
    for (let [key, value] of datos.entries()) {
        console.log(`${key}: ${value}`);
    }
}

// 5. Inicialización de estados al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificamos firmas al iniciar para que los submenús salgan bien
    if (document.getElementById('firmaEmpleado')) {
        checkFirmas();
    }
});