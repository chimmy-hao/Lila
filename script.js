// REGISTRO DEL SERVICE WORKER (Para que Android deje instalar la app)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado', reg))
            .catch(err => console.log('Error al registrar SW', err));
    });
}

function mostrarPantalla(id) {
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-blister').style.display = 'none';
    document.getElementById('pantalla-olvido').style.display = 'none';
    document.getElementById(id).style.display = 'block';
}

// --- NOTIFICACIONES ---
function solicitarPermiso() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            alert("¡Notificaciones activadas!");
            document.getElementById('btn-permiso').innerText = "Alertas listas ✅";
        }
    });
}

function programarNotificacion() {
    const horaInput = document.getElementById('hora-notificacion').value;
    localStorage.setItem('horaAlarma', horaInput);
    
    setInterval(() => {
        const ahora = new Date();
        const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
        if (horaActual === horaInput && Notification.permission === "granted") {
            new Notification("Lila Recordatorio", {
                body: "Es hora de tu pastilla. ¡Que no se te pase!",
                icon: "icono.png"
            });
        }
    }, 60000);
}

// --- EL BLÍSTER ---
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
            if (this.classList.contains('tomada')) {
                localStorage.setItem('dia-' + i, 'tomada');
            } else {
                localStorage.removeItem('dia-' + i);
            }
        };
        grid.appendChild(div);
    }
}

function reiniciarBlister() {
    if(confirm("¿Reiniciar el mes?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = function() {
    generarBlister();
    if(localStorage.getItem('horaAlarma')) {
        document.getElementById('hora-notificacion').value = localStorage.getItem('horaAlarma');
        programarNotificacion();
    }
};
