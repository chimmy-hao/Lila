function mostrarPantalla(id) {
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-blister').style.display = 'none';
    document.getElementById('pantalla-olvido').style.display = 'none';
    document.getElementById(id).style.display = 'block';
}

// --- LÓGICA DE NOTIFICACIONES ---
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
    
    // Para una app web simple, chequeamos la hora cada minuto
    setInterval(() => {
        const ahora = new Date();
        const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
        
        if (horaActual === horaInput && Notification.permission === "granted") {
            new Notification("Recordatorio RaffoFem", {
                body: "Es hora de tomar tu pastilla. ¡No lo olvides!",
                icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
            });
        }
    }, 60000); // Revisa cada 60 segundos
}

// --- LÓGICA DEL BLÍSTER ---
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
    // Cargar hora guardada si existe
    if(localStorage.getItem('horaAlarma')) {
        document.getElementById('hora-notificacion').value = localStorage.getItem('horaAlarma');
        programarNotificacion();
    }
};
