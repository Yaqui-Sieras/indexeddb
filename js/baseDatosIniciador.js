async function IniciarBaseDatos(detallesBD) {
  return new Promise((res, err) => {
    let solicitudApertura = indexedDB.open(detallesBD.nombreBD);
    solicitudApertura.onerror = (evento) => {
      let error = evento.target.error;
      let mensaje_error = `Tenemos un ERROR: ${error.code} / ${error.message}`;
      err(mensaje_error);
    };

    solicitudApertura.onupgradeneeded = (evento) => {
      console.log("Creando base de datos...");
      let bd = evento.target.result;
      let solicitudCreacion;

      for (let i = 0; i < detallesBD.tablas.length; i++) {
        let tabla = detallesBD.tablas[i];
        solicitudCreacion = bd.createObjectStore(tabla.nombre, {
          keyPath: tabla.keyPath,
          autoIncrement: tabla.autoInc,
        });
        if (tabla.keyOpcional.length > 0) {
          let keyExtras = tabla.keyOpcional;
          for (let j = 0; j < keyExtras.length; j++) {
            solicitudCreacion.createIndex(
              keyExtras[j].nombre,
              keyExtras[j].keyPath,
              { unique: keyExtras[j].unique }
            );
          }
        }
        console.log("Tabla creada: " + tabla.nombre);
      }
    };

    solicitudApertura.onsuccess = (evento) => {
      res(evento.target.result);
    };
  });
}

export { IniciarBaseDatos };
