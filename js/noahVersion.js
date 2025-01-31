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
          nombre: "Buscar Nombre",
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

let lista__contacto = document.querySelector("#lista_contactos");
let formulario = document.querySelector("#formulario");
let vistaDetallada = document.querySelector("#vista_detallada");

let BtonAgregar = document.querySelector("#btn-agregar");
BtonAgregar.onclick = () => {
  lista__contacto.classList.add("parte_oculta");
  formulario.classList.remove("parte_oculta");
};

let buscador = document.querySelector("#buscador");
let BtonBuscar = document.querySelector("#btn-buscar");

let listaContactos = document.querySelector("#lista");
let casillaNombre = document.querySelector("#nombre");
let casillaDNI = document.querySelector("#dni");
let BtnGuardar = document.querySelector("#btn-guardar");

let estado = "lista";
let BtnCancelar = document.querySelector("#btn-cancelar");

BtnCancelar.onclick = () => {
  formulario.classList.add("parte_oculta");
  if (estado === "lista") {
    lista__contacto.classList.remove("parte_oculta");
  } else if (estado === "vistaDetallada") {
    vistaDetallada.classList.remove("parte_oculta");
  }
};

let BtnRetroceder = document.querySelector("#btn-retroceder");
BtnRetroceder.onclick = () => {
  vistaDetallada.classList.add("parte_oculta");
  lista__contacto.classList.remove("parte_oculta");
};

let vista_campo_nombre = document.querySelector("#campo__nombre");
let vista_campo_dni = document.querySelector("#campo__dni");

let BtnEditar = document.querySelector("#btn-editar");
/*
BtnEditar.onclick = (evento) => {
  mostrarDetalles(evento.target.value);
};
*/
let BtnEliminar = document.querySelector("#btn-eliminar");
/*
BtnEliminar.onclick = (evento) => {
  let ID = evento.target.value;
  let transaccion = bd.transaction(["Contactos"], "readwrite");
  let tablaContactos = transaccion.objectStore("Contactos");
  let solicitud = tablaContactos.get(ID);
  solicitud.onsuccess = () => {
    let contacto = solicitud.result;
    let ID = contacto.ID;
    tablaContactos.delete(ID);
    transaccion.oncomplete = () => {
      mostrarLista();
    };
  };
};
*/

window.onload = async () => {
  const fecha = new Date();
  let anhoCopy = document.querySelector("#anhoCopy");
  if (parseInt(anhoCopy.textContent) < fecha.getFullYear()) {
    anhoCopy.innerHTML = fecha.getFullYear();
  }

  function mostrarLista() {
    listaContactos.innerHTML = "";
    let articulo;
    let contenido;
    let contArticulos = 0;

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

        articulo.setAttribute("key", fila.key);

        articulo.onclick = (evento) => {
          mostrarDetalles(evento.target.getAttribute("key"));
        };

        listaContactos.appendChild(articulo);
        contArticulos++;
        fila.continue();
      } else {
        if (contArticulos === 0) {
          console.log("No hay datos");
          articulo = document.createElement("article");
          articulo.classList.add("lista__vacia");
          contenido = document.createElement("h2");
          contenido.textContent = "Sin contactos";
          articulo.appendChild(contenido);
          listaContactos.appendChild(articulo);
        }
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

  function mostrarDetalles(ID) {
    ID = parseInt(ID);
    let transaccion = bd.transaction(["Contactos"], "readwrite");
    let tablaContactos = transaccion.objectStore("Contactos");
    let solicitud = tablaContactos.get(ID);
    solicitud.onsuccess = () => {
      let contacto = solicitud.result;
      lista__contacto.classList.add("parte_oculta");
      vistaDetallada.classList.remove("parte_oculta");

      vista_campo_nombre.textContent = contacto.Nombre;
      vista_campo_dni.textContent = contacto.DNI;
      BtnEditar.value = ID;
    };
  }
};
