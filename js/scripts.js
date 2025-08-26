document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector(".banner-wrapper");
  const carrusel = document.querySelector(".carrusel");
  if (!wrapper || !carrusel) return;

  // parámetros (ajusta si quieres)
  const ZOOM_MS = 3500;   // tiempo que dura el zoom (de scale(1) a scale(1.08))
  const FADE_MS = 350;    // tiempo de crossfade (de opacity 0 a 1)
  const FLASH_MS = 220;   // duración del flash blanco
  let timer = null;       // controlador del avance automático
  let current = 0;

  const slides = Array.from(carrusel.querySelectorAll('.tarjeta'));
  if (!slides.length) return;

  // crear elemento flash (una sola vez)
  let flash = wrapper.querySelector('.flash');
  if (!flash) {
    flash = document.createElement('div');
    flash.className = 'flash';
    wrapper.appendChild(flash);
  }

  // limpiar clases de todos
  function resetSlides() {
    slides.forEach(s => {
      s.classList.remove('visible', 'active');
      s.style.zIndex = 1;
    });
  }

  // mostrar slide i sin salto raro
  function showSlide(i) {
    clearTimeout(timer);

    // índice seguro
    i = ((i % slides.length) + slides.length) % slides.length;
    const prev = slides[current];
    const next = slides[i];

    if (next === prev) {
      // si es el mismo, asegúrate que esté activo
      next.classList.add('visible');
      // retriga el zoom suavemente
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add('active')));
      scheduleNext();
      current = i;
      return;
    }

    // 1) preparar next: poner visible con opacity 0 -> then fade in
    next.classList.add('visible');
    next.style.opacity = 0; // forzar estado inicial
    next.style.transform = 'scale(1)'; // aseguramos escala inicial

    // 2) mantenemos prev visible durante el crossfade (evita salto)
    if (prev) {
      prev.style.zIndex = 1;
    }
    next.style.zIndex = 2;

    // small delay: forzar repaint para que la transición de opacity funcione
    requestAnimationFrame(() => {
      // fade in next
      next.style.opacity = 1;
      // start zoom on next (inicia la transición de transform)
      // delay un frame para que opacity haya empezado
      requestAnimationFrame(() => {
        next.classList.add('active');
      });
    });

    // show a white flash briefly to smooth transition edges
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), FLASH_MS);

    // fade out prev after a small overlap (so no jump)
    if (prev) {
      setTimeout(() => {
        prev.style.opacity = 0;
        // quitar clases después de la transición para no acumular estilos
        setTimeout(() => {
          prev.classList.remove('visible', 'active');
          prev.style.opacity = '';
          prev.style.transform = '';
        }, FADE_MS + 20);
      }, Math.max(FADE_MS / 2, 60)); // overlap para natural feel
    }

    current = i;
    scheduleNext();
  }

  // programa el siguiente avance con base en ZOOM_MS
  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      showSlide(current + 1);
    }, ZOOM_MS);
  }

  // controles mínimos (si existen botones)
  const btnLeft = document.getElementById('left');
  const btnRight = document.getElementById('right');
  if (btnLeft) btnLeft.addEventListener('click', () => { showSlide(current - 1); });
  if (btnRight) btnRight.addEventListener('click', () => { showSlide(current + 1); });

  // pausa en hover y resume al salir
  wrapper.addEventListener('mouseenter', () => clearTimeout(timer));
  wrapper.addEventListener('mouseleave', () => scheduleNext());

  // pausa si pestaña no visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleNext();
    else clearTimeout(timer);
  });

  // iniciar (espera imágenes para evitar mediciones erradas)
  const imgs = Array.from(carrusel.querySelectorAll('img'));

  const waitImgs = imgs.length === 0 ? Promise.resolve() : new Promise(resolve => {
    let c = 0;
    imgs.forEach(img => {
      if (img.complete) { c++; if (c === imgs.length) resolve(); }
      else { img.addEventListener('load', () => { c++; if (c === imgs.length) resolve(); }); img.addEventListener('error', () => { c++; if (c === imgs.length) resolve(); }); }
    });
    setTimeout(resolve, 1200);
  });

  (async () => {
    await waitImgs;
    // aseguramos que todos comiencen limpios
    resetSlides();
    // mostrar la primera slide y comenzar el ciclo
    showSlide(0);
  })();



    // --- CARRUSEL "LO MÁS DESTACADO" ---
    // Nota: Este bloque contiene dos lógicas de control para el mismo carrusel
    // (cambiarPagina y mover) que pueden entrar en conflicto al manipular 'transform'.
    // Se recomienda revisar si ambas son necesarias o si deben ser unificadas.
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack) {
        const destacadoSlides = sliderTrack.querySelectorAll('.slide');
        if (destacadoSlides.length > 0) {
            
            const slidesPorPagina = 4;
            const totalPaginas = Math.ceil(destacadoSlides.length / slidesPorPagina);
            let paginaActual = 1;

            function cambiarPagina(pagina) {
                if (pagina === 'prev') {
                    if (paginaActual > 1) paginaActual--;
                } else if (pagina === 'next') {
                    if (paginaActual < totalPaginas) paginaActual++;
                } else {
                    paginaActual = pagina;
                }

                const slideAncho = destacadoSlides[0].offsetWidth;
                const offset = (paginaActual - 1) * slideAncho * slidesPorPagina;
                sliderTrack.style.transform = `translateX(-${offset}px)`;

                for (let i = 1; i <= totalPaginas; i++) {
                    const btn = document.getElementById('btn' + i);
                    if (btn) {
                        btn.classList.toggle('active', i === paginaActual);
                    }
                }
            }
            window.cambiarPagina = cambiarPagina;
            cambiarPagina(1);

            let currentIndex = 0;
            const totalSlides = destacadoSlides.length;

            function mover(direccion) {
                const slidesVisible = window.innerWidth < 480 ? 1 : window.innerWidth < 768 ? 2 : 4;
                const maxIndex = totalSlides - slidesVisible;
                
                currentIndex += direccion;

                if (currentIndex < 0) currentIndex = 0;
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                
                const slideWidth = destacadoSlides[0].offsetWidth;
                sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
            window.mover = mover;
        }
    }


// Recomendaciones scroll horizontal//
const slider = document.getElementById("slider");

window.scrollIzquierda = () => {
slider.scrollBy({ left: -300, behavior: "smooth" });
}

window.scrollDerecha = () => {
slider.scrollBy({ left: 300, behavior: "smooth" });
}
});

const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
  nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
  nav.classList.remove("visible");
});

function actualizarReloj() {
    const ahora = new Date();
    let horas = ahora.getHours().toString().padStart(2, '0');
    let minutos = ahora.getMinutes().toString().padStart(2, '0');
    let segundos = ahora.getSeconds().toString().padStart(2, '0');

    document.getElementById("reloj").textContent = `${horas}:${minutos}:${segundos}`;
}

// Se actualiza cada segundo
setInterval(actualizarReloj, 1000);
// Mostrar al cargar
actualizarReloj();

const peru = document.getElementById("peru");

const colores = ["red", "blue", "green", "purple", "orange", "crimson"];

let indice = 0;
setInterval(() => {
  peru.style.color = colores[indice]; 
  indice = (indice + 1) % colores.length;
}, 1000);

