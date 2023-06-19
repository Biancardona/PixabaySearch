const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacionDiv = document.querySelector("#paginacion");
let totalPaginas;
let iterador;
const registrosPorPagina = 20;
//Inicializar la pagina actual (para la paginacion)
let paginaActual = 1;

window.addEventListener("load", () => {
  formulario.addEventListener("submit", obtainData);
});

function obtainData(e) {
  const buscadorInput = document.querySelector("#termino").value;
  e.preventDefault();
  console.log("buscandoClima");

  if (buscadorInput === "") {
    showAlerta("Campo vacio, intenta de nuevo");
    return;
  }
  consultarApi();
}
function showAlerta(mensaje) {
  const alerta = document.createElement("DIV");
  alerta.classList.add(
    "bg-red-600",
    "border-red-400",
    "text-white",
    "px-4",
    "py-3",
    "text-center",
    "mt-6"
  );
  alerta.textContent = mensaje;
  formulario.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 2000);
}

function consultarApi() {
  const termino = document.querySelector("#termino").value;
  const APIKey = "37345797-522a51401f0c8268f395e3449";
  const url = `https://pixabay.com/api/?key=${APIKey}&q=${termino} &image_type=photo &per_page=${registrosPorPagina}&page=${paginaActual}`;
  // console.log(url);
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data;
      if (data.hits === 0) {
        showAlerta(`No se encontraron resultados para ${termino}`);
      } else {
        showData(data.hits);
        totalPaginas = calcularPaginas(data.totalHits);
        console.log(totalPaginas);
        imprimirPaginacion();
      }
    });
}

//El generador va a registrar la cantodad de elementos de acuerdo a las paginas
//Solo va a registrar los valores de la funcion calcularPaginas
function* crearGenerador(total) {
  for (let i = 1; i < total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function showData(datos) {
  limpiarHTML();
  datos.forEach((elem) => {
    const { largeImageURL, views, likes, previewURL } = elem;
    console.log(previewURL);
    //Para que salgan todos los resultados de la iteracion se debe poner +=
    resultado.innerHTML += `
      
    <div class= "w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
        <div class="bg-white"> 
          <img class= "w-full" src= ${previewURL}>
          <div class= "p-4">
             <p> ${likes}<span class= "font-bold"> Me gusta </span></p>
             <p> ${views}<span class= "font-bold"> Vistas </span></p>
             <a
             class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
             href="${largeImageURL}" target= "_blank" rel="noopener noreferrer">
             Ver imagen
              </a>
          </div>
        </div>
    </div>`;
  });

  //Inject the result in resultado DIV
}
//Aqui en generador lo que toma es el total de paginas
//El generador regresa un iterador
function imprimirPaginacion() {
  paginacionDiv.innerHTML = "";
  iterador = crearGenerador(totalPaginas);
  //.donde retorna true or false and tell us if the iterator is finished (true) or not (false)
  while (true) {
    //destructure the iterator.next values (done and value)
    const { done, value } = iterador.next();
    //Si ya terminó, ya no hagas nada
    if (done) return;
    //Caso contrario: genera un boton por cada elemento en el generador
    const button = document.createElement("a");
    button.href = "#"; //LLeva de una pagina a otra
    button.dataset.pagina = value; //valor 1, 2, 3,...
    button.textContent = value; //Texto 1, 2, 3,...
    button.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "rounded"
    );
    //De acuerdo a la pagina qeu se le de click, va ir cambiando y asignandosele a pagina actual ese value
    button.onclick = () => {
      paginaActual = value;
      console.log(paginaActual);
      consultarApi();
    };
    paginacionDiv.appendChild(button);
  }
  //vera cuantos elementos hay en el paginador y crea esas paginas

  // console.log(iterador.next());
}

function limpiarHTML() {
  resultado.innerHTML = "";
}
