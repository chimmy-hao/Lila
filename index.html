let diaActivoGlobal = null;

function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-calendario', 'pantalla-ayuda', 'pantalla-config'];
    pantallas.forEach(p => document.getElementById(p).style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    if(id === 'pantalla-calendario') {
        const hoy = new Date();
        diaActivoGlobal = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
        generarCalendarioMensual();
        verDetalleDia(diaActivoGlobal);
    }
}

function generarCalendarioMensual() {
    const grid = document.getElementById('calendario-mensual-grid');
    const displayMes = document.getElementById('mes-actual-nombre');
    const ahora = new Date();
    const mes = ahora.getMonth();
    const anio = ahora.getFullYear();
    
    displayMes.innerText = ahora.toLocaleDateString("es-AR", { month: 'long', year: 'numeric' }).toUpperCase();
    grid.innerHTML = '';

    const primerDia = new Date(anio, mes, 1).getDay();
    const totalDias = new Date(anio, mes + 1, 0).getDate();
    const offset = primerDia === 0 ? 6 : primerDia - 1;

    for(let i = 0; i < offset; i++) grid.innerHTML += `<div class="calendar-day" style="border:none"></div>`;

    const historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');

    for(let d = 1; d <= totalDias; d++) {
        const fechaLoop = `${d}/${mes + 1}/${anio}`;
        const emojis = historial[fechaLoop] ? historial[fechaLoop].filter(v => v.length <= 2).join('') : '';
        const clHoy = d === ahora.getDate() ? 'today' : '';
        const clSel = fechaLoop === diaActivoGlobal ? 'selected' : '';
        
        grid.innerHTML += `
            <div class="calendar-day ${clHoy} ${clSel}" onclick="verDetalleDia('${fechaLoop}')">
                <span>${d}</span>
                <div class="emojis-day">${emojis}</div>
            </div>
        `;
    }
}

function verDetalleDia(fecha) {
    diaActivoGlobal = fecha;
    // Actualizar visual del calendario
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    generarCalendarioMensual(); // Refrescar para marcar el seleccionado

    const displayFecha = document.getElementById('fecha-seleccionada');
    const displayContenido = document.getElementById('contenido-detalle');
    
    displayFecha.innerText = fecha === new Date().toLocaleDateString("es-AR") ? "Hoy, " + fecha : fecha;
    
    const historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    const datos = historial[fecha] || [];
    
    displayContenido.innerHTML = '';
    
    if(datos.length === 0) {
        displayContenido.innerHTML = '<div>Nada registrado aún.</div>';
    } else {
        datos.forEach(item => {
            const esEmoji = item.length <= 2;
            displayContenido.innerHTML += `
                <div>${esEmoji ? '✨' : '📝'} ${item}</div>
            `;
        });
    }
}

// LÓGICA DE NOTAS
function abrirModalNota() { document.getElementById('modal-nota').style.display = 'flex'; }
function cerrarModalNota() { document.getElementById('modal-nota').style.display = 'none'; document.getElementById('texto-nota').value = ''; }

function guardarNota() {
    const texto = document.getElementById('texto-nota').value;
    if(!texto) return;

    let historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!historial[diaActivoGlobal]) historial[diaActivoGlobal] = [];
    historial[diaActivoGlobal].push(texto);
    
    localStorage.setItem('historial_lila', JSON.stringify(historial));
    cerrarModalNota();
    verDetalleDia(diaActivoGlobal);
}

// [MANTENER EL RESTO DE FUNCIONES DE BLISTER Y CONFIG]
