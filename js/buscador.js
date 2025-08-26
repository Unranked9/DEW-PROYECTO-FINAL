document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.buscador input');
    const searchButton = document.querySelector('.buscador button');
    
    // Array de destinos y sus URLs
    const destinos = [
        { nombre: "Huacachina", url: "../paginas/Ica.html", region: "Costa" },
        { nombre: "Pacaya Samiria", url: "../paginas/selvaperuana.html", region: "Selva" },
        { nombre: "Machu Picchu", url: "../paginas/cusco.html", region: "Sierra" },
        { nombre: "Valle Sagrado", url: "../paginas/cusco.html", region: "Sierra" },
        { nombre: "Chan Chan", url: "../paginas/Region Costa.html", region: "Costa" },
        { nombre: "Islas Ballestas", url: "../paginas/Region Costa.html", region: "Costa" },
        { nombre: "Cusco", url: "../paginas/cusco.html", region: "Sierra" },
        { nombre: "Ica", url: "../paginas/Ica.html", region: "Costa" },
        { nombre: "Sacsayhuamán", url: "../paginas/cusco.html", region: "Sierra" },
        { nombre: "Ollantaytambo", url: "../paginas/cusco.html", region: "Sierra" },
        { nombre: "Reserva Nacional de Tambopata", url: "../paginas/selvaperuana.html", region: "Selva" },
        { nombre: "Reserva Nacional Pacaya Samiria", url: "../paginas/selvaperuana.html", region: "Selva" },
        { nombre: "Líneas de Nazca", url: "../paginas/Ica.html", region: "Costa" }
    ];

    // Crear el contenedor de resultados
    const resultadosContainer = document.createElement('div');
    resultadosContainer.className = 'resultados-busqueda';
    document.querySelector('.buscador').appendChild(resultadosContainer);

    // Función para filtrar resultados
    function filtrarDestinos(busqueda) {
        const searchTerms = busqueda.toLowerCase().split(' ');
        return destinos.filter(destino => {
            const nombreLower = destino.nombre.toLowerCase();
            const regionLower = destino.region.toLowerCase();
            
            // Buscar coincidencias para cada término de búsqueda
            return searchTerms.every(term => 
                nombreLower.includes(term) ||
                regionLower.includes(term) ||
                // Agregar búsqueda de palabras parciales
                destino.nombre.toLowerCase().split(' ').some(palabra => 
                    palabra.includes(term) || term.includes(palabra)
                )
            );
        });
    }

    // Función para mostrar resultados
    function mostrarResultados(resultados) {
        resultadosContainer.innerHTML = '';
        if (resultados.length > 0) {
            resultados.forEach(destino => {
                const resultado = document.createElement('div');
                resultado.className = 'resultado-item';
                resultado.innerHTML = `
                    <a href="${destino.url}">
                        <span class="destino-nombre">${destino.nombre}</span>
                        <span class="destino-region">${destino.region}</span>
                    </a>
                `;
                resultadosContainer.appendChild(resultado);
            });
            resultadosContainer.style.display = 'block';
        } else {
            resultadosContainer.innerHTML = '<div class="resultado-item">No se encontraron resultados</div>';
            resultadosContainer.style.display = 'block';
        }
    }

    // Evento input para búsqueda en tiempo real
    searchInput.addEventListener('input', function(e) {
        const busqueda = e.target.value;
        if (busqueda.length >= 2) {
            const resultados = filtrarDestinos(busqueda);
            mostrarResultados(resultados);
        } else {
            resultadosContainer.style.display = 'none';
        }
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.buscador')) {
            resultadosContainer.style.display = 'none';
        }
    });

    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        const busqueda = searchInput.value;
        if (busqueda.length >= 2) {
            const resultados = filtrarDestinos(busqueda);
            mostrarResultados(resultados);
        }
    });
});
