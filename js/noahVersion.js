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

let listaContactos = document.querySelector("#lista");
let casillaNombre = document.querySelector("#nombre");
let casillaDNI = document.querySelector("#dni");
let BtnGuardar = document.querySelector("#btn-guardar");
let BtnCancelar = document.querySelector("#btn-cancelar");

window.onload = async () => {
  function mostrarLista() {
    listaContactos.innerHTML = "";
    let articulo;
    let contenido;

    let transaccion = bd.transaction(["Contactos"]);
    let tabla = transaccion.objectStore("Contactos");
    let puntero = tabla.openCursor();
    puntero.onsuccess = (evento) => {
      let fila = evento.target.result;
      if (fila) {
        articulo = document.createElement("article");
        articulo.classList.add("lista__contacto");

        contenido = document.createElement("h2");
        contenido.textContent = fila.value.Nombre;
        articulo.appendChild(contenido);

        contenido = document.createElement("h2");
        contenido.textContent = fila.value.DNI;
        articulo.appendChild(contenido);

        contenido = document.createElement("button");
        contenido.classList.add("btn-editar");
        contenido.value = fila.value.ID;
        contenido.textContent = "Editar";
        contenido.onclick = (evento) => {
          modificarDatos(evento.target.value);
        };
        articulo.appendChild(contenido);

        listaContactos.appendChild(articulo);
        fila.continue();
      }
    };
  }

  console.log("Iniciando Base de Datos...");
  bd = await IniciarBaseDatos(detallesBD);
  console.log("Base de Datos iniciada");
  console.log("La version actual es la nro: " + bd.version);
  mostrarLista();

  BtnGuardar.onclick = (evento) => {
    let tipo = evento.target.value;
    console.log("Tipo de guardago: " + tipo);
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

    let datosaGuardar = {
      Nombre: N,
      DNI: D,
    };

    if (tipo === "crear") {
      tablaContactos.add(datosaGuardar);
    } else {
      datosaGuardar.ID = parseInt(BtnGuardar.value);
      tablaContactos.put(datosaGuardar);
      BtnGuardar.value = "guardar";
    }

    transaccion.oncomplete = () => {
      mostrarLista();
    };

    casillaNombre.value = "";
    casillaDNI.value = "";
  };

  function modificarDatos(ID) {
    ID = parseInt(ID);
    let transaccion = bd.transaction(["Contactos"], "readwrite");
    let tablaContactos = transaccion.objectStore("Contactos");
    let solicitud = tablaContactos.get(ID);
    solicitud.onsuccess = (evento) => {
      let contacto = solicitud.result;
      casillaNombre.value = contacto.Nombre;
      casillaDNI.value = contacto.DNI;
      BtnGuardar.value = ID;
      //tablaContactos.put(contacto);
    };
  }

  //BtnActualizar.onclick = () => {
};
