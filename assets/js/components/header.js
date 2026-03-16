document.addEventListener("DOMContentLoaded", () => {

fetch("components/header.html")
.then(res => res.text())
.then(data => {

document.getElementById("headerContainer").innerHTML = data;

initSearch();

});

});


/* ================= SEARCH ================= */

async function initSearch(){

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

if(!input) return;

let database = [];

try{

database = await fetch("data/search-data.json")
.then(r=>r.json());

}catch(err){

console.error("Search data load error",err);
return;

}


/* ================= SEARCH INPUT ================= */

input.addEventListener("input", () => {

const query = input.value.trim().toLowerCase();

if(query.length < 2){

results.style.display = "none";
return;

}

const filtered = database.filter(item =>
item.name.toLowerCase().includes(query)
).slice(0,15);

renderResults(filtered);

});


/* ================= RENDER RESULTS ================= */

function renderResults(list){

if(list.length === 0){

results.style.display="none";
return;

}

let html="";

list.forEach(item => {

const img = getCDNImage(
item.id,
"thumb",
item.universe,
item.path
);

const parentLabel = item.parent
? item.parent
: formatName(item.universe);

html += `

<div class="search-item" data-url="${item.url}">

<img src="${img}" loading="lazy">

<div>

<div>${item.name}</div>

<div class="search-type">${parentLabel}</div>

</div>

</div>

`;

});

results.innerHTML = html;

results.style.display="block";


/* ================= CLICK RESULT ================= */

document.querySelectorAll(".search-item").forEach(item => {

item.addEventListener("click", () => {

window.location.href = item.dataset.url;

});

});

}

}



/* ================= HELPERS ================= */

function formatName(str){

return str
.replace(/_/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
.trim();

}