const contenedorGaleria = document.getElementById('contenedor-galeria');

// Función para crear una imagen de galería
function crearImagen(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

// Simulación de carga de imágenes desde un JSON o array
const imagenes = [
  { src: 'img/boda1.jpg', alt: 'Ceremonia al aire libre' },
  { src: 'img/boda2.jpg', alt: 'Decoración floral elegante' },
  { src: 'img/boda3.jpg', alt: 'Recepción nocturna' },
  { src: 'img/boda4.jpg', alt: 'Banquete de boda' },
  { src: 'img/boda5.jpg', alt: 'Pastel de bodas personalizado' },
  { src: 'img/boda6.jpg', alt: 'Detalle de anillos' }
];

// Limpia el mensaje inicial y carga la galería
contenedorGaleria.innerHTML = '';
imagenes.forEach(imgData => {
  const imgElement = crearImagen(imgData.src, imgData.alt);
  contenedorGaleria.appendChild(imgElement);
});
