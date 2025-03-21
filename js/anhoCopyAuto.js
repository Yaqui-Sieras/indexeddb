function anhoCopyAuto(anhoCopy) {
  const fecha = new Date();
  if (parseInt(anhoCopy.textContent) < fecha.getFullYear()) {
    anhoCopy.textContent = fecha.getFullYear();
  }
}

let anhoCopy = document.querySelector("#anhoCopy");

anhoCopyAuto(anhoCopy);
