function anhoCopyAuto(anhoCopy) {
  let respuesta;
  const fecha = new Date();
  if (parseInt(anhoCopy) >= fecha.getFullYear()) {
    respuesta = anhoCopy;
  } else {
    respuesta = fecha.getFullYear();
  }
  return respuesta;
}

export { anhoCopyAuto };
