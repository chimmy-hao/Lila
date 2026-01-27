function mostrarPantalla(id) {
    // Ocultar todas las pantallas
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-blister').style.display = 'none';
    
    // Mostrar la seleccionada
    document.getElementById(id).style.display = 'block';
}
// ... (aquí sigue el código anterior que genera los 28 círculos)
const grid = document.getElementById('blister-grid');
const totalDias = 28;

// Crear los 28 círculos
for (let i = 1; i <= totalDias; i++) {
    let div = document.createElement('div');
    div.classList.add('dia');
    div.innerText = i;
    
    // Cargar estado guardado
    if (localStorage.getItem('dia-' + i) === 'tomada') {
        div.classList.add('tomada');
    }

    div.onclick = function() {
        this.classList.toggle('tomada');
        // Guardar en la memoria del celular
        if (this.classList.contains('tomada')) {
            localStorage.setItem('dia-' + i, 'tomada');
        } else {
            localStorage.removeItem('dia-' + i);
        }
    };
    grid.appendChild(div);
}

function reiniciarBlister() {
    if(confirm("¿Quieres reiniciar todo el mes?")) {
        localStorage.clear();
        location.reload();
    }
}
