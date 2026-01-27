function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-config', 'pantalla-ayuda', 'pantalla-olvido'];
    pantallas.forEach(p => document.getElementById(p).style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if(id === 'pantalla-blister') { generarBlister(); actualizarContador(); }
    if(id === 'pantalla-estado') actualizarLista('estado');
    if(id === 'pantalla-actividad') actualizarLista('actividad');
}

function generarBlister() {
    const grid = document.getElementById('blister-grid');
    grid.innerHTML = '';
    
    // Verificación automática de fin de ciclo
    if(localStorage.getItem('dia-28') === 'tomada') {
        setTimeout(() => {
            if(confirm("¡Terminaste el blíster! ¿Quieres guardarlo e iniciar uno nuevo?")) confirmarReinicio();
        }, 300);
    }

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
    let tomadas = 0;
    for (let i = 1; i <= 28; i++) { if (localStorage.getItem('dia-' + i) === 'tomada') tomadas++; }
    document.getElementById('info-quedan').innerText = `Te quedan: ${28 - tomadas} pastillas`;
}

function confirmarReinicio() {
    let tomadas = 0;
    for (let i = 1; i <= 28; i++) { if (localStorage.getItem('dia-' + i) === 'tomada') tomadas++; }
    const fecha = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    let historial = JSON.parse(localStorage.getItem('historialCiclos') || '[]');
    historial.unshift({ fecha, resultado: `${tomadas}/28` });
    localStorage.setItem('historialCiclos', JSON.stringify(historial.slice(0, 12)));
    
    for (let i = 1; i <= 28; i++) { localStorage.removeItem('dia-' + i); }
    generarBlister();
    actualizarContador();
}

function verHistorialCiclos() {
    const modal = document.getElementById('modal-historial');
    const lista = document.getElementById('lista-ciclos');
    let historial = JSON.parse(localStorage.getItem('historialCiclos') || '[]');
    lista.innerHTML = historial.length > 0 ? 
        historial.map(c => `<div class="item-ciclo"><strong>${c.fecha}:</strong> Tomaste ${c.resultado}</div>`).join('') :
        "<p>No hay meses guardados.</p>";
    modal.style.display = 'flex';
}

function cerrarModal() { document.getElementById('modal-historial').style.display = 'none'; }

function guardarDato(tipo, valor) {
    const fecha = new Date().toLocaleDateString();
    let datos = JSON.parse(localStorage.getItem(tipo) || '[]');
    datos.unshift({ fecha, valor });
    localStorage.setItem(tipo, JSON.stringify(datos.slice(0, 5)));
    alert('Registrado: ' + valor);
}

function actualizarLista(tipo) {
    const div = document.getElementById('historial-' + tipo);
    let datos = JSON.parse(localStorage.getItem(tipo) || '[]');
    div.innerHTML = '<strong>Últimos 5:</strong><br>' + datos.map(d => `${d.fecha}: ${d.valor}`).join('<br>');
}

window.onload = () => {
    if(localStorage.getItem('pastillaNombre')) document.getElementById('display-pastilla').innerText = localStorage.getItem('pastillaNombre').split(' (')[0];
};
