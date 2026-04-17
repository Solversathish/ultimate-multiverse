document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("entityContainer");
const galleryContainer = document.getElementById("galleryContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

/* ================= GET PARAMS (UPDATED 🔥) ================= */

const params = new URLSearchParams(window.location.search);

let universe = params.get("universe");
let id = params.get("id");
let path = params.get("path");

/* ✅ CLEAN URL SUPPORT (NEW 🔥) */
if(!id){
  const parts = window.location.pathname.split("/").filter(Boolean);

  if(parts.length >= 2){
    universe = parts[0];
    const slug = parts[parts.length - 1];

    // convert slug → id
    id = slug.replace(/-/g, "_");
  }
}

if(!id){
  container.innerHTML="Entity not found";
  return;
}

let entity=null;
let list=[];

try{

let file;

/* DETERMINE FILE */

if (universe === "fruits") {

  file = "fruits";

} else if (universe === "mythical_creatures") {

  file = "mythical_creatures"; // ✅ FIX

} else if (path) {

  const levels = path.split(",");
  file = levels[levels.length - 1];

} else {

  file = "categories";

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

/* ================= SEO PART (FIXED 🔥) ================= */

try{

  const rawContent = entity?.tabs?.tab1?.content || entity.name;

  const cleanDescription = rawContent
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 160);

  const tab1Title = entity?.tabs?.tab1?.title || "Info";
  const tab2Title = entity?.tabs?.tab2?.title || "Abilities";
  const tab3Title = entity?.tabs?.tab3?.title || "Facts";

  // ✅ TITLE
  document.title = `${entity.name} - ${tab1Title}, ${tab2Title}, ${tab3Title}`;

  // ✅ DESCRIPTION
  const metaDesc = document.querySelector("meta[name='description']");
  if(metaDesc){
    metaDesc.setAttribute("content", cleanDescription);
  }

  // ✅ KEYWORDS
  const keywords = [
    entity.name,
    `${entity.name} ${tab1Title}`,
    `${entity.name} ${tab2Title}`,
    `${entity.name} ${tab3Title}`,
    universe
  ].join(", ");

  const metaKeywords = document.querySelector("meta[name='keywords']");
  if(metaKeywords){
    metaKeywords.setAttribute("content", keywords);
  }

  // ✅ OPEN GRAPH
  const setMeta = (property, content) => {
    let tag = document.querySelector(`meta[property='${property}']`);
    if(!tag){
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setMeta("og:title", document.title);
  setMeta("og:description", cleanDescription);
  setMeta("og:image", getCDNImage(entity.id,"hero",universe,path));
  setMeta("og:type", "website");

}catch(e){
  console.warn("SEO error:", e);
}

/* ======================================================= */

/* BREADCRUMBS */
createBreadcrumbs(universe,path,entity);

/* ENTITY CONTENT */
renderEntity(entity,universe,path);

/* NAVIGATION */
renderNavigation(list,id,universe,path);

/* GALLERY */
renderGallery(entity, universe, path);

});


/* ================= BREADCRUMBS ================= */

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


/* ================= ENTITY ================= */

function renderEntity(entity,universe,path){

const container = document.getElementById("entityContainer");

container.innerHTML = `

<div class="entity-main">

<div class="entity-hero">
<img 
  src="${getCDNImage(entity.id,"hero",universe,path)}" 
  alt="${entity.name} image"
  loading="lazy">
</div>

<div class="entity-details">

<h1 class="entity-name">${entity.name}</h1>

${generateInfoTable(entity.info)}

${generateTabs(entity)}

</div>

</div>

`;

document.getElementById("scrollTopBtn").onclick=()=>{
window.scrollTo({top:0,behavior:"smooth"});
};

}



/* ================= NAVIGATION ================= */

function renderNavigation(list,id,universe,path){

const nav = document.getElementById("entityNavigation");

const index = list.findIndex(i=>i.id===id);

if(index===-1) return;

const prev = list[index-1];
const next = list[index+1];

function buildURL(item){

if(path){
return `entity.html?universe=${universe}&path=${path}&id=${slugify(item.id)}`;
}

return `entity.html?universe=${universe}&id=${slugify(item.id)}`;

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

/* ================= TABS ================= */

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


/* ================= INFO TABLE ================= */

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


/* ================= GALLERY ================= */

function renderGallery(entity, universe, path){

const gallery = document.getElementById("galleryContainer");

if(!entity.gallery_count) return;

let images="";

for(let i=1;i<=entity.gallery_count;i++){

images += `
<img 
  src="${getCDNImage(entity.id,"gallery",universe,path)}g${i}.png" 
  alt="${entity.name} gallery image ${i}" 
  loading="lazy">
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

/* MODAL */

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close-btn");

const allImages = [];

document.querySelectorAll(".gallery-grid img").forEach((img, index) => {

  allImages.push(img.src);

  img.onclick = () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
    renderThumbnails(allImages, index);
  };

});

closeBtn.onclick = () => modal.style.display = "none";

modal.onclick = (e) => {
  if(e.target === modal){
    modal.style.display = "none";
  }
};

function renderThumbnails(images, activeIndex){

const container = document.getElementById("modalThumbnails");

let html = "";

images.forEach((src, index) => {
  html += `<img src="${src}" class="${index===activeIndex?'active':''}" data-index="${index}">`;
});

container.innerHTML = html;

document.querySelectorAll(".modal-thumbnails img").forEach(img => {

  img.onclick = () => {
    const index = img.dataset.index;
    modalImg.src = images[index];

    document.querySelectorAll(".modal-thumbnails img")
    .forEach(i=>i.classList.remove("active"));

    img.classList.add("active");
  };

});

}

}


/* ================= HELPERS ================= */

function formatName(str){
return str.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()).trim();
}

function slugify(name){
return name.toLowerCase().replace(/\s+/g, '-');
}

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if(window.scrollY > 300){
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

scrollBtn.onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};