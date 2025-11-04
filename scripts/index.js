document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave para el botón "Ver más" si existe
  const botonVerMas = document.querySelector(".boton-vermas, .boton-ver-mas, #ver-mas");
  if (botonVerMas) {
    botonVerMas.addEventListener("click", (e) => {
      e.preventDefault();
      const siguiente = document.querySelector("#seccion2, #seccion1 + section, main section:nth-child(2)");
      if (siguiente) siguiente.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Cargar noticias desde JSON y añadir efecto de aparición (solo inline JS, sin tocar CSS base)
  const contenedorNoticias = document.getElementById('contenedor-noticias');
  if (contenedorNoticias) {
    fetch('data/noticias.json')
      .then(r => r.json())
      .then(datos => {
        contenedorNoticias.innerHTML = '';
        datos.forEach((noticia, i) => {
          const div = document.createElement('div');
          div.className = 'noticia';
          div.style.opacity = 0;
          div.style.transform = 'translateY(10px)';
          div.innerHTML = `<h3>${noticia.titulo}</h3>
                           <p class="fecha-noticia">${noticia.fecha}</p>
                           <p>${noticia.contenido}</p>`;
          // small stagger
          setTimeout(() => {
            div.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            div.style.opacity = 1;
            div.style.transform = 'translateY(0)';
          }, i * 120);
          contenedorNoticias.appendChild(div);
        });
      })
      .catch(err => {
        if (contenedorNoticias) contenedorNoticias.innerHTML = '<p>Error al cargar las noticias.</p>';
        console.error('Error cargando noticias:', err);
      });
  }
});
