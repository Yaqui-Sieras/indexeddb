// Datos de configuración de la base de datos
import { detallesBD } from "../bd/estructura.js";
// Inicidor de la base de datos
import { IniciarBaseDatos } from "./baseDatosIniciador.js";
// Actualizador del anho del copyright
import { anhoCopyAuto } from "./anhoCopyAuto.js";

// Iniciar el contenedor de la base de datos
let bd;

// Estado de la página
let estado = "lista";

// Elementos del DOM

// Estructura pagina
let lista_contactos = document.querySelector("#lista_contactos");
let formulario = document.querySelector("#formulario");
let vista_detallada = document.querySelector("#vista_detallada");
let anhoCopy = document.querySelector("#anhoCopy");

// Parte de lista de contacto
let buscador = document.querySelector("#buscador");
let listaContactos = document.querySelector("#lista");
let BtonAgregar = document.querySelector("#btn-agregar");

// Parte de formulario
let casillaNombre = document.querySelector("#nombre");
let casillaDNI = document.querySelector("#dni");
let BtnGuardar = document.querySelector("#btn-guardar");
let BtnCancelar = document.querySelector("#btn-cancelar");

// Parte de Vista detallada
let BtnRetroceder = document.querySelector("#btn-retroceder");
let BtnEditar = document.querySelector("#btn-editar");
let BtnEliminar = document.querySelector("#btn-eliminar");
let vista_campo_nombre = document.querySelector("#campo__nombre");
let vista_campo_dni = document.querySelector("#campo__dni");

// Funciones auxiliares
function crearArticulo(contacto) {
  let articulo = document.createElement("article");
  articulo.classList.add("lista__contacto");

  let contenido = document.createElement("h2");
  contenido.textContent = contacto.Nombre;
  articulo.appendChild(contenido);

  contenido = document.createElement("h2");
  contenido.textContent = contacto.DNI;
  articulo.appendChild(contenido);

  articulo.setAttribute("key", contacto.ID);
  articulo.onclick = (evento) => {
    mostrarDetalles(evento.target.getAttribute("key"));
  };
  return articulo;
}

function lista_vacia() {
  let articulo = document.createElement("article");
  articulo.classList.add("lista__vacia");

  let contenido = document.createElement("h2");
  contenido.textContent = "Sin contactos";
  articulo.appendChild(contenido);

  listaContactos.appendChild(articulo);
}

function actualizarLista(contactos) {
  listaContactos.innerHTML = "";
  if (contactos.length === 0) {
    lista_vacia();
  } else {
    contactos.forEach((contacto) => {
      let articulo = crearArticulo(contacto);
      listaContactos.appendChild(articulo);
    });
  }
}

function actualizarContacto(datos) {
  let contacto_viejo = document.querySelector(`[key="${datos.ID}"]`);

  contacto_viejo.children[0].textContent = datos.Nombre;
  contacto_viejo.children[1].textContent = datos.DNI;
}

function buscarContactos(busqueda) {
  let transaccion = bd.transaction(["Contactos"]);
  let tabla = transaccion.objectStore("Contactos");
  let indice = tabla.index("Buscar Nombre");
  let rango = IDBKeyRange.bound(busqueda, busqueda + "~");
  let puntero = indice.openCursor(rango);

  let contactos = [];
  puntero.onsuccess = (evento) => {
    let resultado = evento.target.result;
    if (resultado) {
      contactos.push(resultado.value);
      resultado.continue();
    } else {
      actualizarLista(contactos);
    }
  };
}

// Eventos
buscador.onkeyup = () => {
  let busqueda = buscador.value;
  if (busqueda === "") {
    mostrarLista();
  } else {
    buscarContactos(busqueda);
  }
};

BtonAgregar.onclick = () => {
  lista_contactos.classList.add("parte_oculta");
  formulario.classList.remove("parte_oculta");
};

BtnGuardar.onclick = (evento) => {
  let tipo = evento.target.value;
  let N = casillaNombre.value;
  let D = casillaDNI.value;

  if (N === "" || D === "") {
    if (N === "") casillaNombre.classList.add("campo_requerido");
    if (D === "") casillaDNI.classList.add("campo_requerido");
    return;
  }

  let transaccion = bd.transaction(["Contactos"], "readwrite");
  let tablaContactos = transaccion.objectStore("Contactos");

  let datosaGuardar = { Nombre: N, DNI: D };

  if (tipo === "crear") {
    tablaContactos.add(datosaGuardar);
  } else {
    datosaGuardar.ID = parseInt(BtnGuardar.value);
    tablaContactos.put(datosaGuardar);
    BtnGuardar.value = "crear";
  }

  transaccion.oncomplete = () => {
    casillaNombre.value = "";
    casillaDNI.value = "";
    if (tipo === "crear") {
      mostrarLista();
    } else {
      actualizarContacto(datosaGuardar);
      mostrarDetalles(datosaGuardar.ID);
    }
  };

  transaccion.onerror = (evento) => {
    let error = evento.target.error;
    if (error.name === "ConstraintError") {
      alert("Ya existe un contacto con ese DNI");
      return;
    }
    console.log(error);
  };
};

BtnCancelar.onclick = () => {
  formulario.classList.add("parte_oculta");
  if (estado === "lista") {
    lista_contactos.classList.remove("parte_oculta");
  } else if (estado === "vista_detallada") {
    vista_detallada.classList.remove("parte_oculta");
    casillaNombre.value = "";
    casillaDNI.value = "";
    BtnGuardar.value = "crear";
  }
  casillaNombre.classList.remove("campo_requerido");
  casillaDNI.classList.remove("campo_requerido");
};

BtnRetroceder.onclick = () => {
  estado = "lista";
  formulario.classList.add("parte_oculta");
  vista_detallada.classList.add("parte_oculta");
  lista_contactos.classList.remove("parte_oculta");
};

BtnEditar.onclick = (evento) => {
  let ID = parseInt(evento.target.value);
  let transaccion = bd.transaction(["Contactos"], "readwrite");
  let tablaContactos = transaccion.objectStore("Contactos");
  let solicitud = tablaContactos.get(ID);
  solicitud.onsuccess = () => {
    let contacto = solicitud.result;
    casillaNombre.value = contacto.Nombre;
    casillaDNI.value = contacto.DNI;
    BtnGuardar.value = ID;

    vista_detallada.classList.add("parte_oculta");
    formulario.classList.remove("parte_oculta");
  };
};

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
    }
  };
};

// Mostrar la lista de contactos
function mostrarLista() {
  listaContactos.innerHTML = "";
  let transaccion = bd.transaction(["Contactos"]);
  let tabla = transaccion.objectStore("Contactos");
  let puntero = tabla.openCursor();

  let contactos = [];
  puntero.onsuccess = (evento) => {
    let fila = evento.target.result;
    if (fila) {
      contactos.push(fila.value);
      fila.continue();
    } else {
      actualizarLista(contactos);
      formulario.classList.add("parte_oculta");
      vista_detallada.classList.add("parte_oculta");
      lista_contactos.classList.remove("parte_oculta");
    }
  };
}

function mostrarDetalles(ID) {
  ID = parseInt(ID);
  estado = "vista_detallada";
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
    formulario.classList.add("parte_oculta");
    vista_detallada.classList.remove("parte_oculta");
  };
}

// Inicialización
window.onload = async () => {
  anhoCopyAuto(anhoCopy);

  console.log("Iniciando Base de Datos...");
  bd = await IniciarBaseDatos(detallesBD);
  console.log("Base de Datos iniciada");
  mostrarLista();
};
