document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("categoryContainer");
const breadcrumbs = document.getElementById("breadcrumbs");
const countElement = document.getElementById("categoryCount");
const alphabetBar = document.getElementById("alphabetBar");
const toggleBtn = document.getElementById("toggleImages");
const sortSelect = document.getElementById("filterSelect");

if(!container) return;

const params = new URLSearchParams(window.location.search);

const universe = params.get("universe");
const path = params.get("path");

if(!universe){
container.innerHTML="Universe not specified";
return;
}

const levels = path ? path.split(",") : [];

let filePath;

/* fruits special case */

if(levels.length===0){

if(universe==="fruits"){
filePath=`data/fruits/fruits.json`;
}
else{
filePath=`data/${universe}/categories.json`;
}

}
else{

const lastLevel = levels[levels.length-1];
filePath = `data/${universe}/${lastLevel}.json`;

}

let items=[];

try{
items = await fetch(filePath).then(r=>r.json());
}catch(err){
console.error(err);
container.innerHTML="Data not found";
return;
}

if(!items.length){
container.innerHTML="No items found";
return;
}


/* ================= BREADCRUMBS ================= */

let breadcrumbHTML = `<a href="home.html">Home</a> > `;

if(levels.length===0){

breadcrumbHTML += `<span>${capitalize(universe)}</span>`;

}
else{

breadcrumbHTML += `
<a href="category.html?universe=${universe}">
${capitalize(universe)}
</a>`;

}

let accumulatedPath="";

levels.forEach((level,index)=>{

accumulatedPath = levels.slice(0,index+1).join(",");

if(index===levels.length-1){

breadcrumbHTML += ` > <span>${formatName(level)}</span>`;

}
else{

breadcrumbHTML += `
> <a href="category.html?universe=${universe}&path=${accumulatedPath}">
${formatName(level)}
</a>`;

}

});

breadcrumbs.innerHTML = breadcrumbHTML;


/* ================= PAGINATION ================= */

let currentPage = 1;
const itemsPerPage = 60;
let filteredItems = items;

function renderPage(){

container.innerHTML="";

const start = (currentPage-1)*itemsPerPage;
const end = start + itemsPerPage;

const pageItems = filteredItems.slice(start,end);

pageItems.forEach(item=>{

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<div class="image-wrapper">
<img src="${getCDNImage(item.id,"thumb",universe,levels[levels.length-1]||"")}" loading="lazy">
</div>
<div class="card-title">${item.name}</div>
`;

card.addEventListener("click",()=>{

if(item.type==="entity"){

window.location.href =
`entity.html?universe=${universe}&path=${path||""}&id=${item.id}`;

}
else{

let newPath;

if(path) newPath = path + "," + item.id;
else newPath = item.id;

window.location.href =
`category.html?universe=${universe}&path=${newPath}`;

}

});

container.appendChild(card);

});

}


/* ================= INIT ================= */

renderPage();
countElement.textContent=`${items.length} Items`;

});


function capitalize(str){
return str.charAt(0).toUpperCase()+str.slice(1);
}

function formatName(str){
return str
.replace(/_/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
.trim();
}