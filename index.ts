type Person = {
    "name": string;
    "height": number;
    "mass": number;
    "hair_color": string;
    "skin_color": string;
    "eye_color": string;
    "birth_year": string;
    "gender": string;
    "homeworld": string;
    "films": string[];
    "species": string[];
    "vehicles": string[];
    "starships": string[];
    "created": Date;
    "edited": Date;
    "url": string;

}

type ServerResponse = {
    count: number;
    results: Person[];
};

//Global variables
let displayedPeople: Person[] = [];
let sortBy: any = {};

//Utils

function drawTable(people: Person[]){
    //Preparamos la tabla HTML
   let tablaHTML:string = `<thead><tr>
   <th><button type="button" class="btn btn-link" onclick=sortPeople("name")>Name</button></th>
   <th><button type="button" class="btn btn-link" onclick=sortPeople("birth_year")>DOB</button></th>
   <th><button type="button" class="btn btn-link" onclick=sortPeople("gender")>Gender</button></th>
   <th><button type="button" class="btn btn-link" onclick=sortPeople("url")>URL</button></th>
   </tr></thead>
   <tbody>`;
  //Iteramos a traes de todos los productos para ir generando las filas de nuestra tabla
  people.forEach((p: Person) => {
   tablaHTML += `<tr><td>${p.name}</td><td>${p.birth_year}</td><td>${p.gender}</td><td>${p.url}</td></tr>`;
  });
  //Cerramos el body de la tabla DESPUES de haber usado el for para generar las filas
  //(no lo cerramos antes para que se generen tantas filas como sea necesario)
  tablaHTML += '</tbody>';
  //Agarramos elementoTabla para setear su HTML interno al que acabamos de crear mas arriba
  document.querySelector('#elementoTabla')!.innerHTML = tablaHTML;
}

//Handlers

function paginatePeople(page: number){
fetch(`https://swapi.dev/api/people/?page=${page}`)
.then(res => res.json())
.then((data: ServerResponse) => {
    displayedPeople = data.results;
    drawTable(data.results);
});
}

function filterPeople(value: String){
    const filteredPeople = displayedPeople.filter((p: Person) => p.name.toLowerCase().includes(value.toLowerCase()) || p.birth_year.toLowerCase().includes(value.toLowerCase()) || p.gender.toLowerCase().includes(value.toLowerCase()) || p.url.toLowerCase().includes(value.toLowerCase()));
    drawTable(filteredPeople);
}

function sortPeople(prop: string){
    if(sortBy[prop]){
        if(sortBy[prop] == 'asc'){
            sortBy[prop] = 'desc';
        }else if(sortBy[prop] == 'desc'){
            sortBy[prop] = null;
        }
    }else{
        sortBy = {[prop]: 'asc'};
    }

const sortedPeople = displayedPeople.toSorted((a: Person, b: Person) => {
    if(sortBy[prop] === 'asc'){
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 :0;
    } else if(sortBy[prop] === 'desc'){
        return a[prop] < b[prop] ? 1 : a[prop] > b[prop] ? -1 :0;
    }else{
        return displayedPeople;
    }
});

drawTable(sortedPeople);

}


fetch('https://swapi.dev/api/people')
.then(res => res.json())
.then((data: ServerResponse) => {
    displayedPeople = data.results;

    drawTable(data.results);

   //Creamos tantas pagians como necesitamos (10 en este caso)
   const pages = Math.ceil(data.count / 10);
   let pagesHTML = '';

   for(let index = 1; index <= pages; index++){
    pagesHTML += `<li class="page-item"><a class="page-link" href="#"" onclick="paginatePeople(${index})">${index}</a></li>`
   }

   const paginationElement: any = document.querySelector('#contenedorPaginas')!.innerHTML = pagesHTML;

   //Escondemos el Spinner una vez que aparece la tabla
   const elementoSpiner: HTMLElement = document.querySelector('#contenedorSpinner')!;
   elementoSpiner.style.display = 'none';
});