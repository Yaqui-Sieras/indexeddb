import { IniciarBaseDatos } from "./baseDatosIniciador.js";

let bd;

let detallesBD = {
  nombreBD: "Datos",
  tablas: [
    {
      nombre: "Contactos",
      keyPath: "ID",
      autoInc: true,
      keyOpcional: [
        {
          nombre: "Buscar nombre",
          keyPath: "Nombre",
          unique: false,
        },
        {
          nombre: "Buscar DNI",
          keyPath: "DNI",
          unique: true,
        },
      ],
    },
  ],
};

window.onload = async () => {
  let listaContactos = document.querySelector("#lista");
  let casillaNombre = document.querySelector("#nombre");
  let casillaDNI = document.querySelector("#dni");
  let BtnGuardar = document.querySelector("#btn-guardar");
  let BtnActualizar = document.querySelector("#btn-actualizar");
  let BtnCancelar = document.querySelector("#btn-cancelar");

  function mostrarLista() {
    listaContactos.innerHTML = "";
    let transaccion = bd.transaction(["Contactos"]);
    let tabla = transaccion.objectStore("Contactos");
    let puntero = tabla.openCursor();
    puntero.onsuccess = (evento) => {
      let fila = evento.target.result;
      if (fila) {
        listaContactos.innerHTML +=
          "<article class='lista__contacto'>" +
          "<h2>" +
          fila.value.Nombre +
          "</h2>" +
          "<h2>" +
          fila.value.DNI +
          "</h2>" +
          "<button class='btn-actualizar' onclick='modificarDatos(" +
          fila.key +
          ")'>Actualizar</button>" +
          "</article>";
        fila.continue();
      }
    };
  }

  console.log("Iniciando Base de Datos...");
  bd = await IniciarBaseDatos(detallesBD);
  console.log("Base de Datos iniciada");
  console.log("La version actual es la nro: " + bd.version);
  mostrarLista();

  //BtnActualizar.onclick = () => {

  BtnGuardar.onclick = () => {
    let N = casillaNombre.value;
    let D = casillaDNI.value;

    if (N === "" || D === "") {
      if (N === "") {
        casillaNombre.classList.add("campo_requerido");
      }

      if (D === "") {
        casillaDNI.classList.add("campo_requerido");
      }

      alert("Debe rellenar los campos requeridos");
      return;
    }

    let transaccion = bd.transaction(["Contactos"], "readwrite");
    let tablaContactos = transaccion.objectStore("Contactos");

    tablaContactos.add({
      Nombre: N,
      DNI: D,
    });

    transaccion.oncomplete = () => {
      mostrarLista();
    };

    casillaNombre.value = "";
    casillaDNI.value = "";
  };

  function modificarDatos(ID) {
    let transaccion = bd.transaction(["Contactos"], "readwrite");
    let tablaContactos = transaccion.objectStore("Contactos");
    let solicitud = tablaContactos.get(ID);
    solicitud.onsuccess = () => {
      let contacto = solicitud.result;
      casillaNombre = contacto.nombre;
      casillaDNI = contacto.dni;
      tablaContactos.put(contacto);
    };
  }
};
