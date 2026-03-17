document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("entityContainer");
const galleryContainer = document.getElementById("galleryContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

const params = new URLSearchParams(window.location.search);

const universe = params.get("universe");
const id = params.get("id");
const path = params.get("path");

if(!id){
container.innerHTML="Entity not found";
return;
}

let entity=null;
let list=[];

try{

let file;

/* DETERMINE FILE */

if(universe === "fruits"){
file="fruits";
}
else if(path){
const levels = path.split(",");
file = levels[levels.length-1];
}
else{
file="categories";
}

/* LOAD DATA */

const data = await fetch(`data/${universe}/${file}.json`)
.then(r=>r.json());

entity = data.find(i=>i.id===id);
list = data;

}catch(err){
console.error(err);
}

if(!entity){
container.innerHTML="Entity not found";
return;
}

/* BREADCRUMBS */

createBreadcrumbs(universe,path,entity);

/* ENTITY CONTENT */

renderEntity(entity,universe,path);

/* NAVIGATION */

renderNavigation(list,id,universe,path);

/* GALLERY */

renderGallery(entity);

});


/* BREADCRUMBS */

function createBreadcrumbs(universe,path,entity){

const breadcrumbs = document.getElementById("breadcrumbs");

let html = `<a href="home.html">Home</a>`;

html += ` > <a href="category.html?universe=${universe}">
${formatName(universe)}
</a>`;

if(path){

const levels = path.split(",");
let build="";

levels.forEach((lvl,i)=>{

build = levels.slice(0,i+1).join(",");

html += ` > <a href="category.html?universe=${universe}&path=${build}">
${formatName(lvl)}
</a>`;

});

}

html += ` > <span>${entity.name}</span>`;

breadcrumbs.innerHTML = html;

}



/* ENTITY PAGE */

function renderEntity(entity,universe,path){

const container = document.getElementById("entityContainer");

container.innerHTML = `

<div class="entity-main">

<div class="entity-hero">
<img src="${getCDNImage(entity.id,"hero",universe,path)}" loading="lazy">
</div>

<div class="entity-details">

<h1 class="entity-name">${entity.name}</h1>

${generateInfoTable(entity.info)}

${generateTabs(entity)}

</div>

</div>

<button id="scrollTopBtn">↑</button>

`;

document.getElementById("scrollTopBtn").onclick=()=>{
window.scrollTo({top:0,behavior:"smooth"});
};

}



/* NAVIGATION */

function renderNavigation(list,id,universe,path){

const nav = document.getElementById("entityNavigation");

const index = list.findIndex(i=>i.id===id);

if(index===-1) return;

const prev = list[index-1];
const next = list[index+1];

function buildURL(item){

if(path){
return `entity.html?universe=${universe}&path=${path}&id=${item.id}`;
}

return `entity.html?universe=${universe}&id=${item.id}`;

}

nav.innerHTML = `

<div class="entity-navigation">

${prev ? `
<button class="nav-btn"
onclick="window.location.href='${buildURL(prev)}'">
← ${prev.name}
</button>` : `<div></div>`}

${next ? `
<button class="nav-btn"
onclick="window.location.href='${buildURL(next)}'">
${next.name} →
</button>` : `<div></div>`}

</div>

`;

}



/* TABS */

function generateTabs(entity){

if(!entity.tabs) return "";

return `

<div class="tabs">

<button class="active" onclick="showTab(event,'tab1')">
${entity.tabs.tab1.title}
</button>

<button onclick="showTab(event,'tab2')">
${entity.tabs.tab2.title}
</button>

<button onclick="showTab(event,'tab3')">
${entity.tabs.tab3.title}
</button>

</div>

<div id="tab1" class="tab-content">
${entity.tabs.tab1.content}
</div>

<div id="tab2" class="tab-content" style="display:none">
${entity.tabs.tab2.content}
</div>

<div id="tab3" class="tab-content" style="display:none">
${entity.tabs.tab3.content}
</div>

`;

}

function showTab(event,id){

document.querySelectorAll(".tab-content")
.forEach(t=>t.style.display="none");

document.querySelectorAll(".tabs button")
.forEach(btn=>btn.classList.remove("active"));

document.getElementById(id).style.display="block";

event.target.classList.add("active");

}



/* INFO TABLE */

function generateInfoTable(info){

if(!info) return "";

let html = `<div class="info-table">`;

Object.entries(info).forEach(([k,v])=>{

html += `
<div class="info-row">
<div class="info-key">${k}</div>
<div class="info-value">${v}</div>
</div>
`;

});

html += `</div>`;

return html;

}



/* GALLERY */

function renderGallery(entity, universe, path){

const gallery = document.getElementById("galleryContainer");

if(!entity.gallery_count) return;

let images="";

for(let i=1;i<=entity.gallery_count;i++){

images += `
<img src="${getCDNImage(entity.id,"gallery",universe,path)}g${i}.png" loading="lazy">
`;

}

gallery.innerHTML = `

<div class="gallery-container">

<h2>Gallery</h2>

<div class="gallery-grid">

${images}

</div>

</div>

`;

}



/* HELPERS */

function formatName(str){

return str
.replace(/_/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
.trim();

}