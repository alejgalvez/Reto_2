// Función para eliminar película
document.addEventListener('DOMContentLoaded', function() {
  const botonesEliminar = document.querySelectorAll('.boton-eliminar');
  
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', function() {
      if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
        const tarjeta = boton.closest('.tarjeta-pelicula');
        tarjeta.remove();
      }
    });
  });
});

