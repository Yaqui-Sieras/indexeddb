function guardarContacto() {
  var N = document.querySelector("#nombre").value;
  var I = document.querySelector("#id").value;

  var transaccion = bd.transaction(["Contactos"], "readwrite");
  var almacen = transaccion.objectStore("Contactos");

  almacen.add({
    nombre: N,
    id: I,
  });

  document.querySelector("#nombre").value = "";
  document.querySelector("#id").value = "";
}
