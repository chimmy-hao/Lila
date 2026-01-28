let diaActivoGlobal = new Date().toLocaleDateString("es-AR");

const infoKirum = {
    "Kirum (3mg/0.02mg)": "Kirum 20: Dosis baja de estrógenos (0.02mg). Se usa para minimizar efectos secundarios como náuseas o sensibilidad mamaria.",
    "Kirum (3mg/0.03mg)": "Kirum 30: Dosis estándar (0.03mg). Ofrece un excelente control del ciclo si hay sangrados irregulares."
};

function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-calendario', 'pantalla-ayuda', 'pantalla-config'];
    pantallas.forEach(p => {
        const el = document.getElementById(p);
        if(el) el.style.display = 'none';
    });
    document.getElementById(id).style.display = 'block';
    
    if(id === 'pantalla-calendario') {
        generarCalendarioMensual();
        verDetalleDia(diaActivoGlobal);
    }
    if(id === 'pantalla-blister') generarBlister();
}

// REGISTRO
function guardarSeleccion(tipo) {
    const fecha = new Date().toLocaleDateString("es-AR");
    const gridId = tipo === 'estado' ? 'grid-estados' : 'grid-actividades';
    const seleccionados = Array.from(document.querySelectorAll(`#${gridId} .selected`)).map(el => el.getAttribute('data-val'));
    
    if(seleccionados.length === 0) return alert("Seleccioná al menos uno");

    let historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!historial[fecha]) historial[fecha] = [];
    seleccionados.forEach(s => { if(!historial[fecha].includes(s)) historial[fecha].push(s); });
    
    localStorage.setItem('historial_lila', JSON.stringify(historial));
    alert("¡Guardado!");
    document.querySelectorAll('.check-item').forEach(el => el.classList.remove('selected'));
    mostrarPantalla('pantalla-inicio');
}

// CALENDARIO
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
                <div class="emojis-day">${emojis}</div>
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
    displayContenido.innerHTML = datos.length ? datos.map(item => `<div>• ${item}</div>`).join('') : 'Sin registros hoy.';
    generarCalendarioMensual();
}

// NOTAS
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

// BLISTER
function generarBlister() {
    const grid = document.getElementById('blister-grid');
    grid.innerHTML = '';
    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const inicioIdx = parseInt(localStorage.getItem('diaInicioSemana') || 0);

    for (let i = 0; i < 7; i++) {
        let h = document.createElement('div');
        h.style.fontWeight = "bold"; h.style.color = "#e91e63";
        h.innerText = diasSemana[(inicioIdx + i) % 7];
        grid.appendChild(h);
    }

    let tomadas = 0;
    for (let i = 1; i <= 28; i++) {
        let div = document.createElement('div');
        div.className = 'dia';
        if (i > 21) div.classList.add('placebo');
        if (localStorage.getItem('dia-' + i) === 'tomada') { div.classList.add('tomada'); tomadas++; }
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

// CONFIG
function cambiarConfigPastilla() {
    const val = document.getElementById('select-pastilla').value;
    localStorage.setItem('pastillaNombre', val);
    document.getElementById('display-pastilla').innerText = val;
    document.getElementById('info-kirum-box').innerText = infoKirum[val];
}

function actualizarDiaInicio() {
    localStorage.setItem('diaInicioSemana', document.getElementById('dia-inicio-semana').value);
    if(document.getElementById('pantalla-blister').style.display === 'block') generarBlister();
}

function programarNotificacion() {
    const hora = document.getElementById('hora-notificacion').value;
    localStorage.setItem('hKirum', hora);
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SET_ALARM', time: hora });
    }
}

function solicitarPermiso() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") new Notification("Lila", { body: "¡Prueba exitosa! 🌸", icon: "icon.jpg" });
    });
}

function confirmarReinicio() {
    if(confirm("¿Reiniciar blíster?")) {
        for (let i = 1; i <= 28; i++) localStorage.removeItem('dia-' + i);
        generarBlister();
    }
}

function verHistorialCiclos() { alert("Función de historial en desarrollo para el próximo mes"); }

window.onload = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
    if(localStorage.getItem('pastillaNombre')) {
        document.getElementById('select-pastilla').value = localStorage.getItem('pastillaNombre');
        cambiarConfigPastilla();
    }
    if(localStorage.getItem('diaInicioSemana')) document.getElementById('dia-inicio-semana').value = localStorage.getItem('diaInicioSemana');
    generarBlister();
};
