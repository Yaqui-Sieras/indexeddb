function anho_automatico(anho) {
  const fecha = new Date();
  if (parseInt(anho.textContent) < fecha.getFullYear()) {
    anho.textContent = fecha.getFullYear();
  }
}

let anho = document.querySelector("#anho");

anho_automatico(anho);
