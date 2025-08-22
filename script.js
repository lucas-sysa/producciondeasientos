// Diccionario de descripciones
const descripciones = {
  "AMB11001-T":"ASIENTO MOTOMEL BLITZ",
  "AMB11002-T":"ASIENTO MOTOMEL BLITZ TUNNING",
  "AMB11003-T":"ASIENTO MOTOMEL BLITZ PLUS",
  "AMDLX11002-T":"ASIENTO MOTOMEL DLX ROJO",
  "AMDLX11001-T":"ASIENTO MOTOMEL DLX AZUL",
  "AMSKUA01-T":"ASIENTO MOTOMEL SKUA",
  "AMSKUA02-T":"ASIENTO MOTOMEL SKUA 250",
  "MPR411":"ASIENTO SKUA 125 X TREME",
  "AMS201-T":"ASIENTO MOTOMEL S2",
  "AMMAX110-T":"ASIENTO MAX 110",
  "AMMAX110-TA":"ASIENTO MAX AMARILLO 110",
  "AMMAX110-TR":"ASIENTO MAX ROJO 110",
  "AMMAX110-TV":"ASIENTO MAX VIOLETA 110",
  "ATSLALOMP110":"ASIENTO SLALOM 110",
  "AISPOT-T":"ASIENTO SPOT S150",
  "AMXMM250-T":"ASIENTO XMM 250",
  "AMVICT-T":"ASIENTO MOTOMEL VICTORY 150",
  "AMSTEU1-T":"ASIENTO STRATO EURO",
  "AMSTALP-T":"ASIENTO STRATO ALPINO",
  "AMSI190-T":"ASIENTO SIRIUS 190",
  "AB180S1-T":"ASIENTO 180S CONDUCTOR",
  "AB180S2-T":"ASIENTO 180S ACOMPAÑANTE",
  "ABTRK2511-T":"ASIENTO TRK 251 CONDUCTOR",
  "ABTRK2512-T":"ASIENTO TRK 251 ACOMPAÑANTE",
  "ABLNC250-T":"ASIENTO LEONCINO 250",
  "ABIMP4001-T":"ASIENTO IMPERIALE 400 CONDUCTOR",
  "ABIMP4002-T":"ASIENTO IMPERIALE 400 ACOMPAÑANTE",
  "ABLNC500-T":"LEONCINO 500",
  "AB251S-T":"ASIENTO 251S CONDUCTOR / ACOMPAÑANTE",
  "ABTNT600I1-T":"ASIENTO TNT 600i CONDUCTOR",
  "ABTNT600I2-T":"ASIENTO TNT 600i ACOMPAÑANTE",
  "AB752S-T":"ASIENTO 752 S",
  "ABTNT152-T":"ASIENTO TNT 15 CONDUCTOR",
  "ABTNT151-T":"ASIENTO TNT 15 ACOMPAÑANTE",
  "ABTRK502-T":"ASIENTO TRK 502 DELANTERO",
  "ABTRK5021-T":"ASIENTO TRK 502 TRASERO",
  "ABTRK7021-T":"ASIENTO CONDUCTOR TRK 702",
  "ABTRK702-T":"ASIENTO ACOMPAÑANTE TRK 702",
  "ABLNC800-T":"ASIENTO LEONCINO 800",
  "ASZAX10001-T":"ASIENTO AX100",
  "ABRK150-T":"ASIENTO RK150",
  "ABKLIGHT202-T":"ASIENTO KLIGHT 202",
  "ABV302C-T":"ASIENTO V302C",
  "ASJOY300-T":"ASIENTO JOYRIDE 300",
  "ATSLALOMP110":"ASIENTO SLALOM P110",
  "AISPOT-T":"ASIENTO SPOT S150",
  "AMBPSC150RE-T":"ASIENTO SC150RE",
  "ATDURBAN150-T":"ASIENTO DURBAN 150",
  "AIDURBAN150-T":"ASIENTO DURBAN 150",
  "ASORBITIII-T":"ASIENTO ORBIT III 125"
};

// Cargar opciones en el select de descripción
const selectDescripcion = document.getElementById("descripcion");
for (const codigo in descripciones) {
  const option = document.createElement("option");
  option.value = codigo;
  option.textContent = descripciones[codigo];
  selectDescripcion.appendChild(option);
}

const form = document.getElementById("produccionForm");
const tabla = document.getElementById("tablaRegistros").querySelector("tbody");

// Cargar registros guardados en localStorage al iniciar
let registros = JSON.parse(localStorage.getItem("registrosProduccion")) || [];

function renderTabla() {
  tabla.innerHTML = "";
  registros.forEach(data => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.orden}</td>
      <td>${data.modelo}</td>
      <td>${data.descripcion}</td>
      <td>${data.cant_producir}</td>
      <td>${data.cant_producida}</td>
      <td>${data.cant_faltante || "-"}</td>
      <td>${data.cant_rotura || "-"}</td>
      <td>${data.comentarios || "-"}</td>
    `;
    tabla.appendChild(row);
  });
}

// Renderizamos al cargar la página
renderTabla();

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  // Reemplazamos descripcion por el texto completo
  data.descripcion = descripciones[data.descripcion] || data.descripcion;

  // Guardamos en registros y localStorage
  registros.push(data);
  localStorage.setItem("registrosProduccion", JSON.stringify(registros));

  // Insertamos fila en la tabla
  renderTabla();

  // Enviamos a Google Sheets
  fetch("https://script.google.com/macros/s/AKfycbxKcDvqlpbhvrdbpyxRNWbLfUUHmjhxy-Mg2AD4NHMaNenheNzwXgE78QRVgtOi1xY8mw/exec", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(response => {
    alert("Registro guardado en Google Sheets ✔");
    form.reset();
  })
  .catch(err => alert("Error: " + err));
});

// -------- BOTONES DE ACCIÓN -------- //

// Limpiar registros
document.getElementById("btnLimpiar").addEventListener("click", () => {
  if(confirm("¿Desea borrar todos los registros?")) {
    registros = [];
    localStorage.removeItem("registrosProduccion");
    renderTabla();
  }
});

// Exportar configuración (guardar localStorage completo)
document.getElementById("btnExportConfig").addEventListener("click", () => {
  const dataStr = JSON.stringify(localStorage);
  const blob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "configuracion.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Importar configuración
document.getElementById("btnImportConfig").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    const imported = JSON.parse(reader.result);
    for(let key in imported) {
      localStorage.setItem(key, imported[key]);
    }
    registros = JSON.parse(localStorage.getItem("registrosProduccion")) || [];
    renderTabla();
    alert("Configuración cargada ✔");
  }
  reader.readAsText(file);
});

// Exportar tabla a Excel
document.getElementById("btnExportExcel").addEventListener("click", () => {
  let tableHTML = `<table><tr>
    <th>ORDEN</th><th>MODELO</th><th>DESCRIPCIÓN</th><th>A PRODUCIR</th>
    <th>PRODUCIDA</th><th>FALTANTE</th><th>ROTURA</th><th>COMENTARIOS</th>
  </tr>`;
  registros.forEach(row => {
    tableHTML += `<tr>
      <td>${row.orden}</td>
      <td>${row.modelo}</td>
      <td>${row.descripcion}</td>
      <td>${row.cant_producir}</td>
      <td>${row.cant_producida}</td>
      <td>${row.cant_faltante || "-"}</td>
      <td>${row.cant_rotura || "-"}</td>
      <td>${row.comentarios || "-"}</td>
    </tr>`;
  });
  tableHTML += `</table>`;

  const blob = new Blob([tableHTML], {type: "application/vnd.ms-excel"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "registros_produccion.xls";
  a.click();
  URL.revokeObjectURL(url);
});
