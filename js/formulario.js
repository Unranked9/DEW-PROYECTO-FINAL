const modal = document.getElementById("modal-exito");
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
      event.preventDefault(); // Evita el envío inmediato
      modal.style.display = "flex"; // Muestra el modal

      // Después de 2 segundos, redirige a inicio.html
      setTimeout(() => {
        window.location.href = "inicio.html";
      }, 2000);
    });

    function cerrarModal() {
      modal.style.display = "none";
      window.location.href = "inicio.html"; 
    }