import { IniciarBaseDatos, AlmacenarContacto } from "./sofiVersionDB.js";
document.addEventListener("DOMContentLoaded", () => {
  IniciarBaseDatos();
  document.getElementById("boton-guardar").addEventListener("click", () => {
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    AlmacenarContacto({
      id: id,
      nombre: nombre,
      apellido: apellido,
      email: email,
      telefono: telefono,
    });
    alert("Contacto guardado");
  });
});
