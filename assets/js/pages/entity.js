document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("entityContainer");
const galleryContainer = document.getElementById("galleryContainer");

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

if(universe==="fruits"){
file="fruits";
}
else if(path){
const levels = path.split(",");
file = levels[levels.length-1];
}
else{
file="categories";
}

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

renderEntity(entity);
renderNavigation(list,id,universe,path);
renderGallery(entity);

});


function renderEntity(entity){

const container=document.getElementById("entityContainer");

container.innerHTML=`

<div class="entity-main">

<div class="entity-hero">
<img src="${getCDNImage(entity.id,"hero")}">
</div>

<div class="entity-details">

<h1>${entity.name}</h1>

</div>

</div>

`;

}


/* ================= NAVIGATION ================= */

function renderNavigation(list,id,universe,path){

const nav=document.getElementById("entityNavigation");

const index=list.findIndex(i=>i.id===id);

if(index===-1) return;

const prev=list[index-1];
const next=list[index+1];

function buildURL(item){

return `entity.html?universe=${universe}&path=${path}&id=${item.id}`;

}

nav.innerHTML=`

<div class="entity-navigation">

${prev ? `<button onclick="window.location.href='${buildURL(prev)}'">← ${prev.name}</button>`:""}

${next ? `<button onclick="window.location.href='${buildURL(next)}'">${next.name} →</button>`:""}

</div>

`;

}


/* ================= GALLERY ================= */

function renderGallery(entity){

const gallery=document.getElementById("galleryContainer");

if(!entity.gallery_count) return;

let images="";

for(let i=1;i<=entity.gallery_count;i++){

images+=`<img src="${getCDNImage(entity.id,"gallery")}g${i}.png">`;

}

gallery.innerHTML=`

<div class="gallery-container">

<h2>Gallery</h2>

<div class="gallery-grid">

${images}

</div>

</div>

`;

}