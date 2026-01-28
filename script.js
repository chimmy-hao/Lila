let diaActivoGlobal = new Date().toLocaleDateString("es-AR");

function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-calendario', 'pantalla-ayuda', 'pantalla-config'];
    pantallas.forEach(p => {
        const el = document.getElementById(p);
        if(el) el.style.display = 'none';
    });
    const pantallaActual = document.getElementById(id);
    if(pantallaActual) pantallaActual.style.display = 'block';
    
    if(id === 'pantalla-calendario') {
        generarCalendarioMensual();
        verDetalleDia(diaActivoGlobal);
    }
    if(id === 'pantalla-blister') {
        generarBlister();
    }
}

function toggleSeleccion(elemento) {
    elemento.classList.toggle('selected');
}

function guardarSeleccion(tipo) {
    const fecha = new Date().toLocaleDateString("es-AR");
    const gridId = tipo === 'estado' ? 'grid-estados' : 'grid-actividades';
    const seleccionados = Array.from(document.querySelectorAll(`#${gridId} .selected`)).map(el => el.getAttribute('data-val'));
    
    if(seleccionados.length === 0) {
        alert("Selecciona al menos una opción");
        return;
    }

    let historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!historial[fecha]) historial[fecha] = [];
    
    seleccionados.forEach(s => {
        if(!historial[fecha].includes(s)) historial[fecha].push(s);
    });
    
    localStorage.setItem('historial_lila', JSON.stringify(historial));
    alert("¡Registrado en tu calendario!");
    
    document.querySelectorAll('.check-item').forEach(el => el.classList.remove('selected'));
    mostrarPantalla('pantalla-inicio');
}

function generarCalendarioMensual() {
    const grid = document.getElementById('calendario-mensual-grid');
    const ahora = new Date();
    const mes = ahora.getMonth();
    const anio = ahora.getFullYear();
    
    document.getElementById('mes-actual-nombre').innerText = ahora.toLocaleDateString("es-AR", { month: 'long', year: 'numeric' }).toUpperCase();
    grid.innerHTML = '';

    const totalDias = new Date(anio, mes + 1, 0).getDate();
    const historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');

    for(let d = 1; d <= totalDias; d++) {
        const fechaLoop = `${d}/${mes + 1}/${anio}`;
        const datos = historial[fechaLoop] || [];
        const emojis = datos.filter(v => v.length <= 2).join('');
        const hasNota = datos.some(v => v.length > 2);
        const clSel = fechaLoop === diaActivoGlobal ? 'selected' : '';
        
        grid.innerHTML += `
            <div class="calendar-day ${clSel}" onclick="verDetalleDia('${fechaLoop}')">
                <span>${d}</span>
                <div style="font-size:10px">${emojis}</div>
                ${hasNota ? '<div class="punto-nota"></div>' : ''}
            </div>`;
    }
}

function verDetalleDia(fecha) {
    diaActivoGlobal = fecha;
    const displayContenido = document.getElementById('contenido-detalle');
    document.getElementById('fecha-seleccionada').innerText = fecha;
    
    const historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    const datos = historial[fecha] || [];
    
    displayContenido.innerHTML = datos.length ? 
        datos.map(item => `<div>• ${item}</div>`).join('') : 
        'Sin registros para este día.';
    
    // Resaltar en el calendario
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    generarCalendarioMensual(); 
}

function abrirModalNota() { document.getElementById('modal-nota').style.display = 'flex'; }
function cerrarModalNota() { document.getElementById('modal-nota').style.display = 'none'; }

function guardarNota() {
    const texto = document.getElementById('texto-nota').value;
    if(!texto) return;
    
    let historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!historial[diaActivoGlobal]) historial[diaActivoGlobal] = [];
    historial[diaActivoGlobal].push(texto);
    
    localStorage.setItem('historial_lila', JSON.stringify(historial));
    document.getElementById('texto-nota').value = '';
    cerrarModalNota();
    verDetalleDia(diaActivoGlobal);
}

function generarBlister() {
    const grid = document.getElementById('blister-grid');
    if(!grid) return;
    grid.innerHTML = '';
    let tomadas = 0;
    for (let i = 1; i <= 28; i++) {
        let div = document.createElement('div');
        div.className = 'dia';
        if (i > 21) div.classList.add('placebo');
        if (localStorage.getItem('dia-' + i) === 'tomada') {
            div.classList.add('tomada');
            tomadas++;
        }
        div.innerText = i;
        div.onclick = function() {
            this.classList.toggle('tomada');
            localStorage.setItem('dia-' + i, this.classList.contains('tomada') ? 'tomada' : '');
            generarBlister();
        };
        grid.appendChild(div);
    }
    document.getElementById('info-quedan').innerText = `Te quedan: ${28 - tomadas} pastillas`;
}

function confirmarReinicio() {
    if(confirm("Se guardará el resumen y se limpiará el blíster.")) {
        let t = 0; for (let i = 1; i <= 28; i++) if (localStorage.getItem('dia-' + i) === 'tomada') t++;
        const f = new Date().toLocaleDateString("es-AR", { month: 'long', year: 'numeric' });
        let h = JSON.parse(localStorage.getItem('historialCiclos') || '[]');
        h.unshift({ f, r: `${t}/28` });
        localStorage.setItem('historialCiclos', JSON.stringify(h));
        for (let i = 1; i <= 28; i++) localStorage.removeItem('dia-' + i);
        generarBlister();
    }
}

function verHistorialCiclos() {
    const h = JSON.parse(localStorage.getItem('historialCiclos') || '[]');
    document.getElementById('lista-ciclos').innerHTML = h.length ? 
        h.map(c => `<div style="padding:10px; border-bottom:1px solid #eee;">${c.f}: ${c.r}</div>`).join('') :
        "No hay historial aún.";
    document.getElementById('modal-historial').style.display = 'flex';
}

function programarNotificacion() { localStorage.setItem('hKirum', document.getElementById('hora-notificacion').value); }
function programarNotificacionRegistro() { localStorage.setItem('hReg', document.getElementById('hora-registro').value); }

window.onload = () => {
    if(localStorage.getItem('hKirum')) document.getElementById('hora-notificacion').value = localStorage.getItem('hKirum');
    if(localStorage.getItem('hReg')) document.getElementById('hora-registro').value = localStorage.getItem('hReg');
    generarBlister();
};
