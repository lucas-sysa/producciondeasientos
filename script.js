document.addEventListener("DOMContentLoaded", () => {

  const scriptURL = "https://script.google.com/macros/s/AKfycbyQ5-8JuPzqIppAEC0IXnsFpk_2BI0lYGNWjuDp9JUGClUzXjM7dD8aU1BXIcLTplwN/exec"; 
  const formProduccion = document.getElementById("formProduccion");
  const formKit = document.getElementById("formKit");

  // Mostrar/ocultar formularios y cargar historial
  window.mostrarFormulario = function(tipo) {
    formProduccion.style.display = (tipo === "produccion") ? "block" : "none";
    formKit.style.display = (tipo === "kit") ? "block" : "none";

    if(tipo === "produccion") cargarHistorial("historialProduccion", "historialProduccionLS");
    else if(tipo === "kit") cargarHistorial("historialKit", "historialKitLS");
  }

  function cargarHistorial(historialId, keyLocalStorage) {
    const contenedor = document.getElementById(historialId);
    if (!contenedor) return;
    const registros = JSON.parse(localStorage.getItem(keyLocalStorage)) || [];
    contenedor.innerHTML = "";
    registros.reverse().forEach(data => {
      const registro = document.createElement("div");
      let texto = "";
      for (const k in data) {
        if (k !== "tipo") texto += `${k}: ${data[k]} | `;
      }
      registro.textContent = texto.slice(0, -3);
      contenedor.appendChild(registro);
    });
  }

  function agregarAlHistorial(historialId, keyLocalStorage, data) {
    const contenedor = document.getElementById(historialId);
    if (!contenedor) return;
    const registro = document.createElement("div");
    let texto = "";
    for (const key in data) {
      if (key !== "tipo") texto += `${key}: ${data[key]} | `;
    }
    registro.textContent = texto.slice(0, -3);
    contenedor.prepend(registro);

    const registros = JSON.parse(localStorage.getItem(keyLocalStorage)) || [];
    registros.push(data);
    localStorage.setItem(keyLocalStorage, JSON.stringify(registros));
  }

function handleSubmit(form, tipo, localStorageKey, historialDiv) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = { tipo };

      for (const input of form.querySelectorAll("[required]")) {
        if (!input.value) {
          alert(`Por favor completa el campo: ${input.name}`);
          input.focus();
          return;
        }
      }

      formData.forEach((value, key) => { data[key] = value; });

     let historial = JSON.parse(localStorage.getItem(localStorageKey)) || [];
      historial.push(data);
      localStorage.setItem(localStorageKey, JSON.stringify(historial));

      cargarHistorial(historialDiv, localStorageKey);

      // Enviar a Google Sheets
      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(res => alert("Registro guardado"))
        .catch(err => alert("Error al enviar: " + err));

      form.reset();
    });
  }

 handleSubmit(formProduccion, "produccion", "historialProduccionLS", "historialProduccion");
  handleSubmit(formKit, "kit", "historialKitLS", "historialKit");

  // Función para cargar historial en la página
  window.cargarHistorial = function(divId, localStorageKey) {
    const div = document.getElementById(divId);
    div.innerHTML = "";
    let historial = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    historial.forEach(item => {
      const entry = document.createElement("div");
      entry.textContent = JSON.stringify(item);
      div.appendChild(entry);
    });
  }

  // Función para limpiar historial
  window.limpiarHistorial = function(localStorageKey, divId) {
    localStorage.removeItem(localStorageKey);
    cargarHistorial(divId, localStorageKey);
  }

});
