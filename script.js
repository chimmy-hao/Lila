// CONFIGURACIÓN DE ZONA HORARIA (Buenos Aires)
const getFechaBA = () => new Date().toLocaleDateString("es-AR");

// REGISTRO DE SELECCIÓN MÚLTIPLE
document.querySelectorAll('.check-item').forEach(item => {
    item.onclick = function() { this.classList.toggle('selected'); }
});

function guardarSeleccion(tipo) {
    const fecha = getFechaBA();
    const seleccionados = Array.from(document.querySelectorAll(`#grid-${tipo}s .selected`)).map(el => el.getAttribute('data-val'));
    
    if(seleccionados.length === 0) return alert("Selecciona al menos una opción");

    let historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');
    if(!historial[fecha]) historial[fecha] = [];
    
    // Evitar duplicados
    seleccionados.forEach(s => { if(!historial[fecha].includes(s)) historial[fecha].push(s); });
    
    localStorage.setItem('historial_lila', JSON.stringify(historial));
    alert("¡Guardado en tu calendario! ✨");
    
    // Limpiar selección
    document.querySelectorAll('.check-item').forEach(el => el.classList.remove('selected'));
    mostrarPantalla('pantalla-inicio');
}

function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-calendario', 'pantalla-ayuda', 'pantalla-config'];
    pantallas.forEach(p => document.getElementById(p).style.display = 'none');
    document.getElementById(id).style.display = 'block';
    
    if(id === 'pantalla-calendario') generarCalendarioMensual();
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
    const offset = primerDia === 0 ? 6 : primerDia - 1; // Ajuste para que empiece en Lunes

    // Espacios vacíos antes del día 1
    for(let i = 0; i < offset; i++) grid.innerHTML += `<div class="calendar-day" style="border:none"></div>`;

    const historial = JSON.parse(localStorage.getItem('historial_lila') || '{}');

    for(let d = 1; d <= totalDias; d++) {
        const fechaLoop = `${d}/${mes + 1}/${anio}`;
        const emojis = historial[fechaLoop] ? historial[fechaLoop].join('') : '';
        const esHoy = d === ahora.getDate() ? 'today' : '';
        
        grid.innerHTML += `
            <div class="calendar-day ${esHoy}">
                <span>${d}</span>
                <div class="emojis-day">${emojis}</div>
            </div>
        `;
    }
}

// RECORDATORIO OPCIONAL
function programarNotificacionRegistro() {
    const hora = document.getElementById('hora-registro').value;
    localStorage.setItem('alarmaRegistro', hora);
}

setInterval(() => {
    const ahora = new Date();
    const actual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const horaReg = localStorage.getItem('alarmaRegistro');
    if (actual === horaReg && Notification.permission === "granted") {
        new Notification("Lila", { body: "¿Cómo estuvo tu día? Entra a registrar tu estado y actividad 🌸" });
    }
}, 60000);

// REPETIR LÓGICA DE BLISTER (de los mensajes anteriores)
function generarBlister() {
    const grid = document.getElementById('blister-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= 28; i++) {
        let div = document.createElement('div');
        div.classList.add('dia');
        div.innerText = i;
        if (i > 21) div.classList.add('placebo');
        if (localStorage.getItem('dia-' + i) === 'tomada') div.classList.add('tomada');
        div.onclick = function() {
            this.classList.toggle('tomada');
            localStorage.setItem('dia-' + i, this.classList.contains('tomada') ? 'tomada' : '');
            actualizarContador();
        };
        grid.appendChild(div);
    }
}
function actualizarContador() {
    let t = 0; for (let i = 1; i <= 28; i++) if (localStorage.getItem('dia-' + i) === 'tomada') t++;
    document.getElementById('info-quedan').innerText = `Te quedan: ${28 - t} pastillas`;
}
window.onload = () => { generarBlister(); };
