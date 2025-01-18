async function IniciarBaseDatos(
  nombreBD,
  nombreTabla,
  keyPrimaria,
  otrasKey = false,
  keyOpcional = []
) {
  return new Promise((res, err) => {
    var solicitudApertura = indexedDB.open(nombreBD);
    solicitudApertura.onerror = (evento) => {
      err(evento.target.error);
    };

    solicitudApertura.onupgradeneeded = (evento) => {
      var baseDatos = evento.target.result;
      var tablaContactos = baseDatos.createObjectStore(nombreTabla, {
        keyPath: keyPrimaria,
      });
      if (otrasKey) {
        for (var i = 0; i < keyOpcional.length; i++) {
          tablaContactos.createIndex(keyOpcional[i], keyOpcional[i], {
            unique: false,
          });
        }
      }
    };

    solicitudApertura.onsuccess = (evento) => {
      res(evento.target.result);
    };
  });
}

export { IniciarBaseDatos };
