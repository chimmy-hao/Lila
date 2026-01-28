let diaActivoGlobal = new Date().toLocaleDateString("es-AR");

// Navegación segura
function mostrarPantalla(id) {
    const ids = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-calendario', 'pantalla-ayuda', 'pantalla-config'];
    ids.forEach(p => {
        const el = document.getElementById(p);
        if(el) el.style.display = 'none';
    });
    const destino = document.getElementById(id);
    if(destino) destino.style.display = 'block';

    if(id === 'pantalla-calendario') generarCalendarioMensual();
    if(id === 'pantalla-blister') generarBlister();
}

// Registro diario
function toggleSeleccion(el) { el.classList.toggle('selected'); }

function guardarSeleccion(tipo) {
    const fecha = new Date().toLocaleDateString("es-AR");
    const gridId = tipo === 'estado' ? 'grid-estados' : 'grid-actividades';
    const items = Array.from(document.querySelectorAll(`#${gridId} .selected`)).map(i => i.getAttribute('data-val'));
    
    if(items.length === 0) return alert("Seleccioná algo");

    let h = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!h[fecha]) h[fecha] = [];
    items.forEach(it => { if(!h[fecha].includes(it)) h[fecha].push(it); });
    
    localStorage.setItem('historial_lila', JSON.stringify(h));
    alert("¡Guardado!");
    document.querySelectorAll('.check-item').forEach(i => i.classList.remove('selected'));
    mostrarPantalla('pantalla-inicio');
}

// Blíster
function generarBlister() {
    const grid = document.getElementById('blister-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const inicio = parseInt(localStorage.getItem('diaInicioSemana') || 0);
    
    for(let i=0; i<7; i++) {
        let d = document.createElement('div');
        d.className = 'cabecera-dia';
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

// Notificaciones
function probarNotificacionDirecta() {
    if(Notification.permission === "granted") {
        new Notification("Lila", { body: "¡Funciona! 🌸", icon: "icon.jpg" });
    } else {
        Notification.requestPermission();
    }
}

// Al cargar
window.onload = () => {
    mostrarPantalla('pantalla-inicio');
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
};
