/* CSS Arquitectónico - Versión Humanage Branding FINAL */
:root { 
    --primary: #2d44bb;      /* Azul institucional de Humanage */
    --accent: #e91e63;       /* Rosa de botones y logos */
    --text: #172b4d; 
    --bg: #f8f9fc;           /* Fondo grisáceo muy suave de la plataforma */
    --border: #e0e4f1;       /* Gris azulado sutil para bordes */
}

body { 
    font-family: 'Inter', sans-serif; 
    background: var(--bg); 
    color: var(--text); 
    padding: 20px; 
    line-height: 1.6; 
}

.wizard-container { 
    max-width: 850px; 
    margin: auto; 
    background: white; 
    padding: 40px; 
    border-radius: 12px; 
    box-shadow: 0 8px 24px rgba(0,0,0,0.05); 
    border-top: 6px solid var(--accent); 
}

header { border-bottom: 2px solid var(--border); margin-bottom: 30px; text-align: center; padding-bottom: 20px; }
header h1 { color: var(--primary); margin-bottom: 5px; }

.step { margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 25px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* --- MEJORA DE INPUTS (ESTILO HUMANAGE UI) --- */
input[type="text"], 
input[type="email"], 
input[type="file"],
.styled-select { 
    width: 100%; 
    padding: 12px 20px; 
    border: 1px solid var(--border); 
    border-radius: 25px; /* Forma redondeada tipo "píldora" */
    background: white;
    font-size: 0.95em;
    transition: all 0.3s ease;
    box-sizing: border-box;
    margin-top: 8px;
}

input:focus, .styled-select:focus { 
    outline: none; 
    border-color: var(--primary); 
    box-shadow: 0 0 0 3px rgba(45, 68, 187, 0.1); 
}

label { 
    font-weight: 600; 
    color: var(--primary); 
    font-size: 0.9em; 
    margin-left: 10px; 
}

/* --- TABLAS (LIMPIAS Y SIN BORDES NEGROS) --- */
.rs-container { margin-top: 25px; }
.input-table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 0; 
    margin-top: 10px; 
    border: 1px solid var(--border); 
    border-radius: 12px; 
    overflow: hidden; 
}

.input-table th { 
    background: #f0f2f9; 
    padding: 15px; 
    text-align: left; 
    border-bottom: 1px solid var(--border); 
    font-size: 0.85em; 
    color: var(--primary); 
    text-transform: uppercase;
}

.input-table td { border-bottom: 1px solid var(--border); padding: 5px; }
.input-table tr:last-child td { border-bottom: none; }

/* Input dentro de la tabla */
.input-table input { 
    border-radius: 0; 
    border: none; 
    padding: 12px; 
    background: transparent; 
}
.input-table input:focus { 
    background: #fff; 
    border-radius: 20px; 
    outline: 2px solid var(--accent); 
}

/* --- OTROS ELEMENTOS --- */
.help-box { background: #eff2ff; padding: 15px; border-radius: 8px; font-size: 0.9em; margin: 15px 0; border-left: 5px solid var(--primary); color: var(--primary); }
.help-box.warning { background: #fffae6; border-left-color: #ffab00; color: #856404; }

.checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.check-item { background: #fafbfc; border: 1px solid var(--border); padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
.check-item:hover { background: #f0f2f9; border-color: var(--primary); }

.btn-submit { background: var(--accent); color: white; border: none; padding: 18px; width: 100%; border-radius: 35px; font-size: 1.1em; font-weight: bold; cursor: pointer; transition: 0.3s; margin-top: 20px; }
.btn-submit:hover { background: #d81b60; box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3); }

.btn-outline-lg { width: 100%; padding: 12px; background: white; border: 2px dashed var(--primary); color: var(--primary); cursor: pointer; border-radius: 25px; font-weight: 600; }
.btn-outline-lg:hover { background: #f0f2f9; }

.demo-table { width: 100%; border-collapse: collapse; font-size: 0.9em; border-radius: 8px; overflow: hidden; }
.demo-table th, .demo-table td { border: 1px solid var(--border); padding: 10px; }
