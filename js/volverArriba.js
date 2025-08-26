document.addEventListener('DOMContentLoaded', function() {
    // Crear el botón
    const botonArriba = document.createElement('button');
    botonArriba.id = 'btnVolverArriba';
    botonArriba.innerHTML = '↑';
    document.body.appendChild(botonArriba);

    // Mostrar/ocultar el botón según el scroll
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            botonArriba.style.display = 'block';
        } else {
            botonArriba.style.display = 'none';
        }
    };

    // Función para volver arriba con animación suave
    botonArriba.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
