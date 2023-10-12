//Global variables
var displayedPeople = [];
var sortBy = {};
//Utils
function drawTable(people) {
    //Preparamos la tabla HTML
    var tablaHTML = "<thead><tr>\n   <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"name\")>Name</button></th>\n   <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"birth_year\")>DOB</button></th>\n   <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"gender\")>Gender</button></th>\n   <th><button type=\"button\" class=\"btn btn-link\" onclick=sortPeople(\"url\")>URL</button></th>\n   </tr></thead>\n   <tbody>";
    //Iteramos a traes de todos los productos para ir generando las filas de nuestra tabla
    people.forEach(function (p) {
        tablaHTML += "<tr><td>".concat(p.name, "</td><td>").concat(p.birth_year, "</td><td>").concat(p.gender, "</td><td>").concat(p.url, "</td></tr>");
    });
    //Cerramos el body de la tabla DESPUES de haber usado el for para generar las filas
    //(no lo cerramos antes para que se generen tantas filas como sea necesario)
    tablaHTML += '</tbody>';
    //Agarramos elementoTabla para setear su HTML interno al que acabamos de crear mas arriba
    document.querySelector('#elementoTabla').innerHTML = tablaHTML;
}
//Handlers
function paginatePeople(page) {
    fetch("https://swapi.dev/api/people/?page=".concat(page))
        .then(function (res) { return res.json(); })
        .then(function (data) {
        displayedPeople = data.results;
        drawTable(data.results);
    });
}
function filterPeople(value) {
    var filteredPeople = displayedPeople.filter(function (p) { return p.name.toLowerCase().includes(value.toLowerCase()) || p.birth_year.toLowerCase().includes(value.toLowerCase()) || p.gender.toLowerCase().includes(value.toLowerCase()) || p.url.toLowerCase().includes(value.toLowerCase()); });
    drawTable(filteredPeople);
}
function sortPeople(prop) {
    var _a;
    if (sortBy[prop]) {
        if (sortBy[prop] == 'asc') {
            sortBy[prop] = 'desc';
        }
        else if (sortBy[prop] == 'desc') {
            sortBy[prop] = null;
        }
    }
    else {
        sortBy = (_a = {}, _a[prop] = 'asc', _a);
    }
    var sortedPeople = displayedPeople.toSorted(function (a, b) {
        if (sortBy[prop] === 'asc') {
            return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
        }
        else if (sortBy[prop] === 'desc') {
            return a[prop] < b[prop] ? 1 : a[prop] > b[prop] ? -1 : 0;
        }
        else {
            return displayedPeople;
        }
    });
    drawTable(sortedPeople);
}
fetch('https://swapi.dev/api/people')
    .then(function (res) { return res.json(); })
    .then(function (data) {
    displayedPeople = data.results;
    drawTable(data.results);
    //Creamos tantas pagians como necesitamos (10 en este caso)
    var pages = Math.ceil(data.count / 10);
    var pagesHTML = '';
    for (var index = 1; index <= pages; index++) {
        pagesHTML += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\"\" onclick=\"paginatePeople(".concat(index, ")\">").concat(index, "</a></li>");
    }
    var paginationElement = document.querySelector('#contenedorPaginas').innerHTML = pagesHTML;
    //Escondemos el Spinner una vez que aparece la tabla
    var elementoSpiner = document.querySelector('#contenedorSpinner');
    elementoSpiner.style.display = 'none';
});
