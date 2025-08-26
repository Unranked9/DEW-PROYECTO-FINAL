// --- DATOS DE LOS PUNTOS DE INTERÉS ---
// Este es un array (una lista) de objetos. Cada objeto representa un lugar en la selva.
// Contiene: nombre, latitud, longitud, a qué región pertenece y una descripción corta.
const SELVA_SPOTS = [
  { name: "Iquitos (Loreto)", lat: -3.75, lng: -73.25, region: "norte", desc: "Capital de la Amazonía, acceso por río." },
  { name: "Tarapoto (San Martín)", lat: -6.48, lng: -76.37, region: "norte", desc: "Ciudad de las Palmeras, lagunas y cataratas." },
  { name: "Pucallpa (Ucayali)", lat: -8.38, lng: -74.55, region: "centro", desc: "Puerto fluvial importante y comunidades nativas." },
  { name: "Tingo María (Huánuco)", lat: -9.29, lng: -75.99, region: "centro", desc: "Parque Nacional, La Bella Durmiente." },
  { name: "Manu (Madre de Dios)", lat: -12.25, lng: -71.73, region: "sur", desc: "Parque Nacional, una de las áreas más biodiversas del mundo." },
  { name: "Tambopata (Madre de Dios)", lat: -12.83, lng: -69.40, region: "sur", desc: "Reserva Nacional, collpas de guacamayos." },
];


// --- INICIALIZACIÓN DEL MAPA ---
// Crea una instancia del mapa en el elemento HTML con el id 'map'.
// zoomControl: true -> Muestra los botones de + y - para hacer zoom.
// scrollWheelZoom: true -> Permite hacer zoom con la rueda del ratón.
const map = L.map('map', { zoomControl: true, scrollWheelZoom: true });

// (Opcional) Definir una vista inicial para evitar que el mapa aparezca sin centro.
// Centrado aproximado en la Amazonía / Perú oriental con zoom general.
map.setView([-8.5, -73.0], 5);

// Añade la capa de mapa base de OpenStreetMap.
// Esto es lo que permite que se vea el mapa del mundo.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, // El nivel máximo de zoom permitido.
  attribution: '&copy; OpenStreetMap contributors' // Créditos que aparecen en el mapa.
}).addTo(map); // Añade la capa de teselas al mapa que acabamos de crear.


// --- CAPAS PARA MARCADORES Y RUTA ---
// Se crean capas especiales para poder añadir o quitar elementos del mapa fácilmente.
const markersLayer = L.layerGroup().addTo(map); // Una capa para todos los marcadores (pines).
const routeLayer = L.polyline([], { weight: 4, color: '#0B6623' }); // Una capa para la línea de la ruta (verde selva).


// --- REFERENCIAS A ELEMENTOS DE LA INTERFAZ (UI) ---
// Se obtienen los elementos del HTML para poder interactuar con ellos.
const regionSelect = document.getElementById('regionSelect'); // El menú desplegable para elegir la región.
const rutaToggle = document.getElementById('rutaToggle');     // El checkbox para mostrar/ocultar la ruta.
const btnAjustar = document.getElementById('btnAjustar');     // El botón para centrar el mapa.


// --- FUNCIONES AUXILIARES ---

// Función para obtener los puntos filtrados según la región seleccionada.
function getFiltered() {
  const region = regionSelect.value; // Obtiene el valor actual del menú desplegable.
  if (region === 'todas') return SELVA_SPOTS; // Si es "todas", devuelve la lista completa.
  return SELVA_SPOTS.filter(s => s.region === region); // Si no, filtra la lista y devuelve solo los de esa región.
}

// Función para ajustar la vista del mapa a un conjunto de puntos.
function fitTo(points) {
  if (!points.length) return; // Si no hay puntos, no hace nada.
  // Crea un rectángulo imaginario que contiene todos los puntos.
  const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
  // En caso de que el contenedor haya cambiado de tamaño, forzamos recalculo.
  map.invalidateSize();
  // Ajusta el mapa a ese rectángulo, con un pequeño margen (pad).
  map.fitBounds(bounds.pad(0.12));
}


// --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
// Esta función se encarga de dibujar y actualizar todo en el mapa.
function render() {
  const points = getFiltered(); // Obtiene los puntos que se deben mostrar.

  // 1. Limpiar el mapa antes de dibujar lo nuevo.
  markersLayer.clearLayers(); // Borra todos los marcadores anteriores.
  if (map.hasLayer(routeLayer)) routeLayer.remove(); // Quita la línea de la ruta si existe.

  // 2. Dibujar los marcadores.
  points.forEach(spot => { // Recorre cada punto que se debe mostrar.
    const marker = L.marker([spot.lat, spot.lng]); // Crea un marcador en su latitud y longitud.
    // Le asigna un popup (ventana emergente) con su nombre y descripción.
    marker.bindPopup(`<strong>${spot.name}</strong><br/><small>${spot.desc}</small>`);
    markersLayer.addLayer(marker); // Añade el marcador a la capa de marcadores.
  });

  // 3. Dibujar la ruta (si está activada).
  if (rutaToggle.checked && points.length > 0) { // Comprueba si el checkbox está marcado y hay puntos.
    // Crea una lista de coordenadas de los puntos visibles (filtrados).
    const path = points.map(s => [s.lat, s.lng]);
    // Actualiza la línea de la ruta con esas coordenadas y la añade al mapa.
    routeLayer.setLatLngs(path).addTo(map);
  }

  // 4. Ajustar la vista del mapa.
  fitTo(points); // Llama a la función para centrar el mapa en los puntos visibles.
}


// --- EVENT LISTENERS (ESCUCHADORES DE EVENTOS) ---
// Asignan funciones a los eventos de los controles de la UI.

// Cuando el usuario cambia la selección en el menú, se vuelve a renderizar el mapa.
regionSelect.addEventListener('change', render);
// Cuando el usuario marca/desmarca el checkbox, se vuelve a renderizar el mapa.
rutaToggle.addEventListener('change', render);
// Cuando el usuario hace clic en el botón "Ajustar vista", se centra el mapa en los puntos filtrados.
btnAjustar.addEventListener('click', () => fitTo(getFiltered()));


// --- PRIMERA EJECUCIÓN ---
// Llama a render() una vez al cargar la página para que el mapa no aparezca vacío.
render();


// --- MEJORA DE ACCESIBILIDAD ---
// Permite cerrar cualquier popup abierto en el mapa presionando la tecla "Escape".
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') map.closePopup();
});
