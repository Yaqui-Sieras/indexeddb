let bd;

function IniciarBaseDatos() {
  const solicitud = indexedDB.open("Datos-De-Contactos");

  solicitud.addEventListener("error", MostrarError);
  solicitud.addEventListener("success", Comenzar);
  solicitud.addEventListener("upgradeneeded", CrearAlmacenes);
}

function MostrarError(evento) {
  const error = evento.target.error;
  alert("Tenemos un ERROR: " + error.code + " / " + error.message);
}

function Comenzar(evento) {
  bd = evento.target.result;
}

function CrearAlmacenes(evento) {
  const basededatos = evento.target.result;
  const almacen = basededatos.createObjectStore("Contactos", { keyPath: "id" });
  almacen.createIndex("BuscarNombre", "nombre", { unique: false });
  // PENDIENTE: agregar mas almacenes
}

function AlmacenarContacto(contacto) {
  const transaccion = bd.transaction(["Contactos"], "readwrite");
  const almacen = transaccion.objectStore("Contactos");
  if (contacto?.id && contacto?.nombre) {
    almacen.add(contacto);
  } else {
    alert("Contacto invalido");
  }
}

export { IniciarBaseDatos, AlmacenarContacto };
