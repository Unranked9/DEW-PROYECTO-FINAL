
const botonesLeerMas = document.querySelectorAll('.leer-mas');
botonesLeerMas.forEach(boton => {
boton.addEventListener('click', () => {
const tarjeta = boton.closest('.reco-card');
const corto = tarjeta.querySelector('.texto-corto');
const completo = tarjeta.querySelector('.texto-completo');

const estaVisible = completo.style.display === "inline";
completo.style.display = estaVisible ? "none" : "inline";
corto.style.display = estaVisible ? "inline" : "none";
boton.textContent = estaVisible ? "Leer más" : "Leer menos";
});
});

   // Recomendaciones scroll horizontal//
const slider = document.getElementById("slider");

window.scrollIzquierda = () => {
slider.scrollBy({ left: -300, behavior: "smooth" });
}

window.scrollDerecha = () => {
slider.scrollBy({ left: 300, behavior: "smooth" });
}
