var bd;
var cajaContactos;

function IniciarBaseDatos() {
  var busqueda = document.querySelector("#formulario-busqueda");
  busqueda.addEventListener("submit", buscarContacto);
  cajaContactos = document.querySelector(".caja-contactos");
  var BtnGuardar = document.querySelector("#btn-guardar");
  BtnGuardar.addEventListener("click", AlmacenarContacto);

  var solicitud = indexedDB.open("Datos-De-Contactos");

  solicitud.addEventListener("error", MostrarError);
  solicitud.addEventListener("success", Comenzar);
  solicitud.addEventListener("upgradeneeded", CrearAlmacen);
}

function MostrarError(evento) {
  var error = evento.target.error;
  alert("Tenemos un ERROR: " + error.code + " / " + error.message);
}

function Comenzar(evento) {
  bd = evento.target.result;
  Mostrar();
}

function CrearAlmacen(evento) {
  var basededatos = evento.target.result;
  var almacen = basededatos.createObjectStore("Contactos", { keyPath: "id" });
  almacen.createIndex("BuscarNombre", "nombre", { unique: false });
}

function AlmacenarContacto() {
  var N = document.querySelector("#nombre").value.toLowerCase();
  var I = document.querySelector("#id").value;
  var E = document.querySelector("#edad").value;

  var transaccion = bd.transaction(["Contactos"], "readwrite");
  var almacen = transaccion.objectStore("Contactos");
  transaccion.addEventListener("complete", Mostrar);

  almacen.add({
    nombre: N,
    id: I,
    edad: E,
  });

  document.querySelector("#nombre").value = "";
  document.querySelector("#id").value = "";
  document.querySelector("#edad").value = "";
}

function Mostrar() {
  cajaContactos.innerHTML = "";

  var transaccion = bd.transaction(["Contactos"]);
  var almacen = transaccion.objectStore("Contactos");

  var puntero = almacen.openCursor();
  puntero.addEventListener("success", MostrarContactos);
}

function MostrarContactos(evento) {
  var puntero = evento.target.result;
  if (puntero) {
    cajaContactos.innerHTML +=
      "<div>" +
      puntero.value.nombre +
      " / " +
      puntero.value.id +
      " / " +
      puntero.value.edad +
      "<input type='button' class='btn-editar' value='Editar' onclick='seleccionarContacto(\"" +
      puntero.value.id +
      "\")'>" +
      "<input type='button' class='btn-borrar' value='Borrar' onclick='eliminarContacto(\"" +
      puntero.value.id +
      "\")'>" +
      "</div>";
    puntero.continue();
  }
}

function seleccionarContacto(clave) {
  var padreBoton = document.querySelector(".padre-boton");
  padreBoton.innerHTML =
    "<input type='button' class='btn-actualizar' value='Actualizar' onclick='actualizarContacto()'>";

  var transaccion = bd.transaction(["Contactos"], "readwrite");
  var almacen = transaccion.objectStore("Contactos");
  var solicitud = almacen.get(clave);

  solicitud.addEventListener("success", function () {
    document.querySelector("#nombre").value = solicitud.result.nombre;
    document.querySelector("#id").value = solicitud.result.id;
    document.querySelector("#edad").value = solicitud.result.edad;
  });
}

function buscarContacto(evento) {
  evento.preventDefault();
  document.querySelector(".resultado-busqueda").innerHTML = "";
  var buscar = document.querySelector("#buscar-nombre").value.toLowerCase();

  var transaccion = bd.transaction(["Contactos"]);
  var almacen = transaccion.objectStore("Contactos");

  var indice = almacen.index("BuscarNombre");
  var rango = IDBKeyRange.only(buscar);
  var puntero = indice.openCursor(rango);

  puntero.addEventListener("success", mostrarBusqueda);
}

function mostrarBusqueda(evento) {
  var resultadoBusqueda = document.querySelector(".resultado-busqueda");

  var puntero = evento.target.result;
  if (puntero) {
    resultadoBusqueda.innerHTML +=
      "<div>" +
      puntero.value.nombre +
      " / " +
      puntero.value.id +
      " / " +
      puntero.value.edad +
      "</div>";
    puntero.continue();
  }
  document.querySelector("#buscar-nombre").value = "";
}

function eliminarContacto(key) {
  var transaccion = bd.transaction(["Contactos"], "readwrite");
  var almacen = transaccion.objectStore("Contactos");
  transaccion.addEventListener("complete", Mostrar);

  var solicitud = almacen.delete(key);
}

window.addEventListener("load", IniciarBaseDatos);
