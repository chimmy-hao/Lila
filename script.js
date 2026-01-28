let diaActivoGlobal = new Date().toLocaleDateString("es-AR");

const infoKirum = {
    "Kirum 20 (3mg/0.02mg)": "Kirum 20: Dosis baja de estrógenos (0.02mg). Se usa para minimizar efectos secundarios como náuseas o sensibilidad mamaria.",
    "Kirum 30 (3mg/0.03mg)": "Kirum 30: Dosis estándar (0.03mg). Ofrece un excelente control del ciclo si hay sangrados entre periodos."
};

function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-blister', 'pantalla-estado', 'pantalla-actividad', 'pantalla-calendario', 'pantalla-ayuda', 'pantalla-config'];
    pantallas.forEach(p => { if(document.getElementById(p)) document.getElementById(p).style.display = 'none'; });
    document.getElementById(id).style.display = 'block';
    if(id === 'pantalla-calendario') { generarCalendarioMensual(); verDetalleDia(diaActivoGlobal); }
    if(id === 'pantalla-blister') { generarBlister(); }
}

function cambiarConfigPastilla() {
    const val = document.getElementById('select-pastilla').value;
    localStorage.setItem('pastillaNombre', val);
    document.getElementById('display-pastilla').innerText = val;
    document.getElementById('info-kirum-box').innerText = infoKirum[val];
}

function actualizarDiaInicio() {
    const val = document.getElementById('dia-inicio-semana').value;
    localStorage.setItem('diaInicioSemana', val);
    generarBlister();
}

function generarBlister() {
    const grid = document.getElementById('blister-grid');
    grid.innerHTML = '';
    
    const nombresDias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const inicioIdx = parseInt(localStorage.getItem('diaInicioSemana') || 0);
    
    // Cabecera de días
    for (let i = 0; i < 7; i++) {
        let cabecera = document.createElement('div');
        cabecera.style.fontWeight = "bold";
        cabecera.style.color = "#e91e63";
        cabecera.innerText = nombresDias[(inicioIdx + i) % 7];
        grid.appendChild(cabecera);
    }

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

function solicitarPermiso() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            new Notification("Lila", { body: "¡Notificaciones activadas! 🌸", icon: "icon.jpg" });
        }
    });
}

function programarNotificacion() {
    const hora = document.getElementById('hora-notificacion').value;
    localStorage.setItem('hKirum', hora);
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SET_ALARM', time: hora });
    }
}

// ... (Aquí incluir funciones de calendario y notas del paso anterior)

window.onload = () => {
    if(localStorage.getItem('pastillaNombre')) {
        document.getElementById('select-pastilla').value = localStorage.getItem('pastillaNombre');
        cambiarConfigPastilla();
    }
    if(localStorage.getItem('diaInicioSemana')) {
        document.getElementById('dia-inicio-semana').value = localStorage.getItem('diaInicioSemana');
    }
    if(localStorage.getItem('hKirum')) {
        document.getElementById('hora-notificacion').value = localStorage.getItem('hKirum');
    }
    generarBlister();
};
