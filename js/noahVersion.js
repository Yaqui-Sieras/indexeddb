import { IniciarBaseDatos } from "./baseDatosIniciador.js";
import { anhoCopyAuto } from "./anhoCopyAuto.js";

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

let bd;

// Estructura pagina
let lista_contactos = document.querySelector("#lista_contactos");
let formulario = document.querySelector("#formulario");
let vista_detallada = document.querySelector("#vista_detallada");
let estado = "lista";

// Parte de lista de contacto
let buscador = document.querySelector("#buscador");
let BtonBuscar = document.querySelector("#btn-buscar");

let listaContactos = document.querySelector("#lista");

let BtonAgregar = document.querySelector("#btn-agregar");
BtonAgregar.onclick = () => {
  lista_contactos.classList.add("parte_oculta");
  formulario.classList.remove("parte_oculta");
};

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
    vista_detallada.classList.add("parte_oculta");
    formulario.classList.add("parte_oculta");
    lista_contactos.classList.remove("parte_oculta");
  };
}

// Parte de formulario
let casillaNombre = document.querySelector("#nombre");
let casillaDNI = document.querySelector("#dni");

let BtnGuardar = document.querySelector("#btn-guardar");
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
    if (tipo === "crear") {
      mostrarLista();
    } else {
      mostrarDetalles(datosaGuardar.ID);
    }
  };

  casillaNombre.value = "";
  casillaDNI.value = "";
};

let BtnCancelar = document.querySelector("#btn-cancelar");
BtnCancelar.onclick = () => {
  formulario.classList.add("parte_oculta");
  if (estado === "lista") {
    lista_contactos.classList.remove("parte_oculta");
  } else if (estado === "vistaDetallada") {
    vista_detallada.classList.remove("parte_oculta");
  }
};

// Parte de Vista detallada
function mostrarDetalles(ID) {
  ID = parseInt(ID);
  let transaccion = bd.transaction(["Contactos"], "readwrite");
  let tablaContactos = transaccion.objectStore("Contactos");
  let solicitud = tablaContactos.get(ID);
  solicitud.onsuccess = () => {
    let contacto = solicitud.result;

    vista_campo_nombre.textContent = contacto.Nombre;
    vista_campo_dni.textContent = contacto.DNI;
    BtnEditar.value = ID;
    BtnEliminar.value = ID;

    lista_contactos.classList.add("parte_oculta");
    vista_detallada.classList.remove("parte_oculta");
  };
}

let BtnRetroceder = document.querySelector("#btn-retroceder");
BtnRetroceder.onclick = () => {
  vista_detallada.classList.add("parte_oculta");
  lista_contactos.classList.remove("parte_oculta");
};

let BtnEditar = document.querySelector("#btn-editar");

BtnEditar.onclick = (evento) => {};

let vista_campo_nombre = document.querySelector("#campo__nombre");
let vista_campo_dni = document.querySelector("#campo__dni");

let BtnEliminar = document.querySelector("#btn-eliminar");

BtnEliminar.onclick = (evento) => {
  let ID = parseInt(evento.target.value);

  let transaccion = bd.transaction(["Contactos"], "readwrite");
  let tablaContactos = transaccion.objectStore("Contactos");
  let solicitud = tablaContactos.get(ID);
  solicitud.onsuccess = () => {
    let contacto = solicitud.result;
    let confirmacion = confirm(
      `¿Está seguro de eliminar a ${contacto.Nombre}?`
    );
    if (confirmacion) {
      tablaContactos.delete(ID);
      transaccion.oncomplete = () => {
        mostrarLista();
      };
    } else {
      return;
    }
  };
};

window.onload = async () => {
  let anhoCopy = document.querySelector("#anhoCopy");
  anhoCopy.innerHTML = anhoCopyAuto(anhoCopy.textContent);

  console.log("Iniciando Base de Datos...");
  bd = await IniciarBaseDatos(detallesBD);
  console.log("Base de Datos iniciada");
  console.log("La version actual es la nro: " + bd.version);
  mostrarLista();
};
