// Espera a que todo el contenido del HTML esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

  // --- DATOS DE LOS PUNTOS DE INTERÉS DE LA SIERRA ---
  const SIERRA_SPOTS = [
    { name: "Cajamarca", lat: -7.16, lng: -78.52, region: "norte", desc: "Baños del Inca, carnaval y arquitectura colonial." },
    { name: "Chachapoyas (Kuélap)", lat: -6.23, lng: -77.87, region: "norte", desc: "Fortaleza preincaica y catarata de Gocta." },
    { name: "Huaraz (Callejón de Huaylas)", lat: -9.53, lng: -77.53, region: "norte", desc: "Cordillera Blanca, lagunas y deportes de montaña." },
    { name: "Huancayo (Valle del Mantaro)", lat: -12.07, lng: -75.21, region: "centro", desc: "Capital del centro, feria dominical y artesanías." },
    { name: "Ayacucho", lat: -13.16, lng: -74.22, region: "centro", desc: "Semana Santa, artesanías y huariques gastronómicos." },
    { name: "Huancavelica", lat: -12.79, lng: -74.97, region: "centro", desc: "Baños termales y paisaje andino auténtico." },
    { name: "Cusco (Machu Picchu)", lat: -13.52, lng: -71.97, region: "sur", desc: "Capital inca, maravilla del mundo y Valle Sagrado." },
    { name: "Puno (Lago Titicaca)", lat: -15.84, lng: -70.02, region: "sur", desc: "Islas flotantes de los Uros y tradiciones aimaras." },
    { name: "Arequipa (Colca)", lat: -16.41, lng: -71.54, region: "sur", desc: "Cañón del Colca y miradores de cóndores." }
  ];

  // --- INICIALIZACIÓN DEL MAPA ---
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error("No se encontró el elemento del mapa #map");
    return; 
  }
  
  const map = L.map(mapElement, { zoomControl: true, scrollWheelZoom: true });
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // --- CAPAS PARA MARCADORES Y RUTA ---
  const markersLayer = L.layerGroup().addTo(map);
  const routeLayer = L.polyline([], { color: '#8B4513', weight: 4 }); // Ruta de color marrón

  // --- REFERENCIAS A ELEMENTOS DE LA INTERFAZ (UI) ---
  const regionSelect = document.getElementById('regionSelect');
  const rutaToggle = document.getElementById('rutaToggle');
  const btnAjustar = document.getElementById('btnAjustar');

  if (!regionSelect || !rutaToggle || !btnAjustar) {
      console.error("Faltan elementos de control del mapa en el HTML.");
      return;
  }

  // --- FUNCIONES ---
  function getFiltered() {
    const region = regionSelect.value;
    if (region === 'todas') return SIERRA_SPOTS;
    return SIERRA_SPOTS.filter(s => s.region === region);
  }

  function fitTo(points) {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds.pad(0.12));
  }

  // --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
  function render() {
    const points = getFiltered();

    markersLayer.clearLayers();
    routeLayer.remove();

    points.forEach(spot => {
      const marker = L.marker([spot.lat, spot.lng]);
      marker.bindPopup(`<strong>${spot.name}</strong><br/><small>${spot.desc}</small>`);
      markersLayer.addLayer(marker);
    });

    if (rutaToggle.checked) {
      const path = SIERRA_SPOTS.map(s => [s.lat, s.lng]);
      routeLayer.setLatLngs(path).addTo(map);
    }

    fitTo(points);
  }

  // --- EVENTOS ---
  regionSelect.addEventListener('change', render);
  rutaToggle.addEventListener('change', render);
  btnAjustar.addEventListener('click', () => fitTo(getFiltered()));

  // --- PRIMERA EJECUCIÓN ---
  render();
  
  // --- ACCESIBILIDAD ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') map.closePopup();
  });

});
