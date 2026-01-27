// Función para navegar entre pantallas
function mostrarPantalla(id) {
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-blister').style.display = 'none';
    document.getElementById('pantalla-olvido').style.display = 'none';
    
    document.getElementById(id).style.display = 'block';
}

// Función para construir el blíster
function generarBlister() {
    const grid = document.getElementById('blister-grid');
    const totalDias = 28;

    grid.innerHTML = ''; // Limpiar antes de crear

    for (let i = 1; i <= totalDias; i++) {
        let div = document.createElement('div');
        div.classList.add('dia');
        div.innerText = i;
        
        // Si es de los últimos 7 días (placebos), le damos un estilo diferente
        if (i > 21) {
            div.classList.add('placebo');
        }

        // Marcar si ya estaba tomada en la memoria
        if (localStorage.getItem('dia-' + i) === 'tomada') {
            div.classList.add('tomada');
        }

        // Acción al hacer clic
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
    if(confirm("¿Deseas borrar todo el progreso del mes?")) {
        localStorage.clear();
        location.reload();
    }
}

// Ejecutar al cargar la página
window.onload = function() {
    generarBlister();
};
