if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Lila/sw.js').then(() => console.log("SW OK"));
}

function mostrarPantalla(id) {
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-blister').style.display = 'none';
    document.getElementById('pantalla-olvido').style.display = 'none';
    document.getElementById(id).style.display = 'block';
}

function solicitarPermiso() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") alert("¡Notificaciones activas!");
    });
}

function programarNotificacion() {
    const hora = document.getElementById('hora-notificacion').value;
    localStorage.setItem('horaAlarma', hora);
    setInterval(() => {
        const ahora = new Date();
        const actual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
        if (actual === hora && Notification.permission === "granted") {
            new Notification("Lila", { body: "Es hora de tu pastilla 🌸", icon: "icono.png" });
        }
    }, 60000);
}

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
            if (this.classList.contains('tomada')) localStorage.setItem('dia-' + i, 'tomada');
            else localStorage.removeItem('dia-' + i);
        };
        grid.appendChild(div);
    }
}

window.onload = () => {
    generarBlister();
    if(localStorage.getItem('horaAlarma')) {
        document.getElementById('hora-notificacion').value = localStorage.getItem('horaAlarma');
        programarNotificacion();
    }
};
