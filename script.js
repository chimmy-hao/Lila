let diaActivoGlobal = new Date().toLocaleDateString("es-AR");

const infoKirum = {
    "Kirum 20": "Kirum 20: Dosis baja (0.02mg). Ideal para reducir efectos secundarios.",
    "Kirum 30": "Kirum 30: Dosis estándar (0.03mg). Mejor control del ciclo."
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

// ESTA ES LA FUNCIÓN QUE ARREGLA LOS BOTONES
function toggleSeleccion(elemento) {
    // Usamos 'selected' porque es lo que está en tu CSS
    elemento.classList.toggle('selected');
}

function guardarSeleccion(tipo) {
    const fecha = new Date().toLocaleDateString("es-AR");
    const gridId = tipo === 'estado' ? 'grid-estados' : 'grid-actividades';
    
    // Buscamos elementos con la clase 'selected'
    const seleccionados = Array.from(document.querySelectorAll(`#${gridId} .selected`)).map(el => el.getAttribute('data-val'));
    
    if(seleccionados.length === 0) return alert("Seleccioná al menos uno");

    let historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!historial[fecha]) historial[fecha] = [];
    
    seleccionados.forEach(s => { 
        if(!historial[fecha].includes(s)) historial[fecha].push(s); 
    });
    
    localStorage.setItem('historial_lila', JSON.stringify(historial));
    alert("¡Guardado!");
    
    // Limpiamos la selección visual
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
        const clSel = fechaLoop === diaActivoGlobal ? 'selected' : ''; // 'selected' para el día del calendario también
        
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
    
    displayContenido.innerHTML = datos.length ? 
        datos.map(item => `<div style="margin-bottom:5px;">• ${item}</div>`).join('') : 
        'No hay registros.';
        
    // Refrescamos para marcar el día seleccionado
    const dias = document.querySelectorAll('.calendar-day');
    dias.forEach(d => d.classList.remove('selected'));
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
    
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const inicio = parseInt(localStorage.getItem('diaInicioSemana') || 0);
    
    // Cabecera días
    for(let i=0; i<7; i++) {
        let d = document.createElement('div');
        d.style.color = '#e91e63'; d.style.fontWeight = 'bold'; d.style.fontSize='12px';
        d.innerText = dias[(inicio + i) % 7];
        grid.appendChild(d);
    }

    let t = 0;
    for(let i=1; i<=28; i++) {
        let d = document.createElement('div');
        d.className = 'dia';
        if(i > 21) d.classList.add('placebo');
        if(localStorage.getItem('dia-'+i) === 'tomada') { d.classList.add('tomada'); t++; }
        d.innerText = i;
        d.onclick = () => {
            d.classList.toggle('tomada');
            localStorage.setItem('dia-'+i, d.classList.contains('tomada') ? 'tomada' : '');
            generarBlister();
        };
        grid.appendChild(d);
    }
    document.getElementById('info-quedan').innerText = `Te quedan: ${28 - t} pastillas`;
}

function cambiarConfigPastilla() {
    const val = document.getElementById('select-pastilla').value;
    localStorage.setItem('pastillaNombre', val);
    document.getElementById('display-pastilla').innerText = val;
    document.getElementById('info-kirum-box').innerText = infoKirum[val];
}

function actualizarDiaInicio() {
    localStorage.setItem('diaInicioSemana', document.getElementById('dia-inicio-semana').value);
    generarBlister();
}

function confirmarReinicio() {
    if(confirm("¿Seguro querés empezar una caja nueva?")) {
        // Guardar historial
        let t = 0; for(let i=1; i<=28; i++) if(localStorage.getItem('dia-'+i) === 'tomada') t++;
        const f = new Date().toLocaleDateString("es-AR", { month: 'long', year: 'numeric' });
        let h = JSON.parse(localStorage.getItem('historialCiclos') || '[]');
        h.unshift({ f, r: `${t}/28` });
        localStorage.setItem('historialCiclos', JSON.stringify(h));
        
        // Borrar
        for(let i=1; i<=28; i++) localStorage.removeItem('dia-'+i);
        generarBlister();
    }
}

function verHistorialCiclos() {
    const h = JSON.parse(localStorage.getItem('historialCiclos') || '[]');
    document.getElementById('lista-ciclos').innerHTML = h.length ? 
        h.map(c => `<div style="border-bottom:1px solid #eee; padding:5px;">${c.f}: ${c.r}</div>`).join('') : 
        "Sin datos.";
    document.getElementById('modal-historial').style.display = 'flex';
}

function probarNotificacionDirecta() {
    if(Notification.permission === "granted") {
        new Notification("Lila", { body: "¡Funciona! 🌸", icon: "icon.jpg" });
    } else {
        Notification.requestPermission();
    }
}

function programarNotificacion() {
    const hora = document.getElementById('hora-notificacion').value;
    localStorage.setItem('hKirum', hora);
    if(navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SET_ALARM', time: hora });
    }
}

window.onload = () => {
    if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
    if(localStorage.getItem('pastillaNombre')) {
        document.getElementById('select-pastilla').value = localStorage.getItem('pastillaNombre');
        cambiarConfigPastilla();
    }
    if(localStorage.getItem('diaInicioSemana')) document.getElementById('dia-inicio-semana').value = localStorage.getItem('diaInicioSemana');
    generarBlister();
};
