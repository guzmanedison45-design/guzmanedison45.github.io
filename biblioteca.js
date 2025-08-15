/* ======================================
   BIBLIOTECA DIGITAL
   Permite subir, listar, descargar y eliminar archivos
   usando localStorage en el navegador
====================================== */

// 1️⃣ Arreglo de archivos (se carga desde localStorage si existe)
let archivos = JSON.parse(localStorage.getItem("archivos")) || [];

// 2️⃣ Crear elementos en el DOM dinámicamente
const main = document.querySelector("main");

// Contenedor para la biblioteca
const contenedorBiblioteca = document.createElement("div");
contenedorBiblioteca.id = "biblioteca";
main.appendChild(contenedorBiblioteca);

// Formulario de subida
const form = document.createElement("form");
form.id = "formArchivo";
form.innerHTML = `
  <input type="text" id="nombreArchivo" placeholder="Nombre del archivo" required>
  <input type="file" id="archivo" required>
  <button type="submit">Subir archivo</button>
`;
contenedorBiblioteca.appendChild(form);

// Buscador
const buscar = document.createElement("input");
buscar.type = "text";
buscar.id = "buscar";
buscar.placeholder = "Buscar archivo...";
buscar.style.marginTop = "10px";
contenedorBiblioteca.appendChild(buscar);

// Lista de archivos
const listaArchivos = document.createElement("div");
listaArchivos.id = "listaArchivos";
listaArchivos.style.marginTop = "20px";
contenedorBiblioteca.appendChild(listaArchivos);

// 3️⃣ Función para mostrar archivos
function mostrarArchivos(filtro = "") {
    listaArchivos.innerHTML = "";
    archivos
        .filter(a => a.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .forEach((archivo, index) => {
            const div = document.createElement("div");
            div.classList.add("archivo");
            div.style.border = "1px solid #ccc";
            div.style.padding = "10px";
            div.style.margin = "5px 0";
            div.style.borderRadius = "5px";
            div.style.background = "#f8f8f8";

            const url = URL.createObjectURL(dataURLtoBlob(archivo.data));
            div.innerHTML = `
                <b>${archivo.nombre}</b> 
                <a href="${url}" download="${archivo.nombre}">[Descargar]</a>
                <span class="eliminar" style="float:right; color:red; cursor:pointer;" onclick="eliminarArchivo(${index})">🗑️</span>
            `;
            listaArchivos.appendChild(div);
        });
}

// 4️⃣ Función para convertir DataURL a Blob
function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

// 5️⃣ Evento para subir archivo
form.addEventListener("submit", function(e){
    e.preventDefault();
    const nombre = document.getElementById("nombreArchivo").value;
    const archivoInput = document.getElementById("archivo").files[0];
    if(!archivoInput) return alert("Selecciona un archivo");

    const reader = new FileReader();
    reader.onload = function(){
        archivos.push({nombre: nombre, data: reader.result});
        localStorage.setItem("archivos", JSON.stringify(archivos));
        mostrarArchivos();
        form.reset();
    }
    reader.readAsDataURL(archivoInput);
});

// 6️⃣ Función para eliminar archivo
function eliminarArchivo(index){
    archivos.splice(index,1);
    localStorage.setItem("archivos", JSON.stringify(archivos));
    mostrarArchivos(buscar.value);
}

// 7️⃣ Buscador en vivo
buscar.addEventListener("input", function(){
    mostrarArchivos(this.value);
});

// 8️⃣ Mostrar archivos al cargar
mostrarArchivos();
