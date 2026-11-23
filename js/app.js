// Estado inicial de tareas (cargado desde localStorage si existe)
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let siguienteId = tareas.length > 0 ? Math.max(...tareas.map((t) => t.id)) + 1 : 1;

// Referencias a elementos del DOM
const formulario = document.getElementById("formulario");
const entrada = document.getElementById("entrada");
const lista = document.getElementById("lista");
const vacio = document.getElementById("vacio");
const contador = document.getElementById("contador");
const botonLimpiar = document.getElementById("limpiar");

// Calcula cuantas tareas faltan por completar y actualiza el contador y el mensaje vacio
const actualizarResumen = () => {
  const pendientes = tareas.filter((tarea) => !tarea.completada).length;
  contador.textContent = pendientes;
  vacio.hidden = tareas.length > 0;
  botonLimpiar.hidden = !tareas.some((tarea) => tarea.completada);
};

// Crea el elemento <li> de una tarea manteniendo la estructura que espera estilos.css
const crearElementoTarea = (tarea) => {
  const li = document.createElement("li");
  li.className = tarea.completada ? "tarea completada" : "tarea";
  li.dataset.id = String(tarea.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = tarea.completada;
  checkbox.setAttribute("aria-label", `Marcar "${tarea.texto}" como completada`);

  checkbox.addEventListener("change", () => {
    alternarCompletada(tarea.id);
  });

  const spanTexto = document.createElement("span");
  spanTexto.className = "texto";
  spanTexto.textContent = tarea.texto;

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "eliminar";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.setAttribute("aria-label", `Eliminar "${tarea.texto}"`);

  botonEliminar.addEventListener("click", () => {
    eliminarTarea(tarea.id);
  });

  li.appendChild(checkbox);
  li.appendChild(spanTexto);
  li.appendChild(botonEliminar);

  return li;
};

// Renderiza toda la lista de tareas de forma dinamica sin recargar la pagina
const renderizarTareas = () => {
  lista.innerHTML = "";

  tareas.forEach((tarea) => {
    const elementoTarea = crearElementoTarea(tarea);
    lista.appendChild(elementoTarea);
  });

  localStorage.setItem("tareas", JSON.stringify(tareas));
  actualizarResumen();
};

// Agrega una nueva tarea si el texto no esta vacio
const agregarTarea = (textoCrudo) => {
  const textoLimpio = textoCrudo.trim();
  if (textoLimpio === "") {
    return;
  }

  const nuevaTarea = {
    id: siguienteId++,
    texto: textoLimpio,
    completada: false,
  };

  tareas.push(nuevaTarea);
  renderizarTareas();
};

// Cambia el estado completada / pendiente de una tarea
const alternarCompletada = (idTarea) => {
  tareas = tareas.map((tarea) =>
    tarea.id === idTarea ? { ...tarea, completada: !tarea.completada } : tarea
  );
  renderizarTareas();
};

// Elimina una tarea por su id
const eliminarTarea = (idTarea) => {
  tareas = tareas.filter((tarea) => tarea.id !== idTarea);
  renderizarTareas();
};

// Elimina todas las tareas marcadas como completadas
const limpiarCompletadas = () => {
  tareas = tareas.filter((tarea) => !tarea.completada);
  renderizarTareas();
};

// Evento de envio del formulario
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  agregarTarea(entrada.value);
  entrada.value = "";
  entrada.focus();
});

botonLimpiar.addEventListener("click", limpiarCompletadas);

// Renderizado inicial al cargar la pagina
renderizarTareas();