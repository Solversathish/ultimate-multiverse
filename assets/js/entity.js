document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const galleryContainer = document.getElementById("galleryContainer");

  const params = new URLSearchParams(window.location.search);
  const universe = params.get("universe");
  const entityId = params.get("id");

  if(!universe || !entityId){
    container.innerHTML="Invalid entity";
    return;
  }

  let entity = null;

  try{

    const universeData = await fetch("data/universe_entities.json")
    .then(res=>res.json());

    if(universeData[universe] && entityId === universe){
      entity = universeData[universe];
    }

    if(!entity){

      const worldData = await fetch("data/world_entities.json")
      .then(res=>res.json());

      if(worldData[entityId]){
        entity = worldData[entityId];
      }

    }

    if(!entity){

      const subworldData = await fetch("data/subworld_entities.json")
      .then(res=>res.json());

      if(subworldData[entityId]){
        entity = subworldData[entityId];
      }

    }

  }catch(err){
    console.error(err);
  }

  if(!entity){
    container.innerHTML="Entity not found";
    return;
  }

  createBreadcrumbs(universe,entity);
  renderEntity(entity);
  renderGallery(entity);

});


function createBreadcrumbs(universe, entity){

  const breadcrumbs = document.getElementById("breadcrumbs");

  const params = new URLSearchParams(window.location.search);
  const path = params.get("path");
  const entityId = params.get("id");

  let html = `<a href="home.html">Home</a> > `;

  // ===== UNIVERSE LEVEL =====
  if(entityId === universe){

    // Current page = universe entity (About Anime)
    html += `<span>${formatName(universe)}</span>`;

  } else {

    html += `<a href="category.html?universe=${universe}">
      ${formatName(universe)}
    </a>`;

  }

  // ===== CATEGORY LEVELS =====
  if(path){

    const levels = path.split(",");
    let accumulated = "";

    levels.forEach((level,index)=>{

      accumulated = levels.slice(0,index+1).join(",");

      // last level should be text if entity page
      if(index === levels.length - 1 && entityId !== universe){

        html += ` > <span>${formatName(level)}</span>`;

      }else{

        html += ` > <a href="category.html?universe=${universe}&path=${accumulated}">
        ${formatName(level)}
        </a>`;

      }

    });

  }

  // ===== ENTITY LEVEL =====
  if(entityId !== universe && (!path || !path.endsWith(entityId))){

    html += ` > <span>${entity.name}</span>`;

  }

  breadcrumbs.innerHTML = html;

}


function renderEntity(entity){

  const container=document.getElementById("entityContainer");

  container.innerHTML=`

  <div class="entity-main">

    <div class="entity-hero">
      <img src="${getCDNImage(entity.id,"hero")}">
    </div>

    <div class="entity-details">

      <h1 class="entity-name">${entity.name}</h1>

      ${generateInfoTable(entity.info)}

      <div class="tab-content">
        ${entity.description || ""}
      </div>

    </div>

  </div>

  `;

}


function generateInfoTable(info){

  if(!info) return "";

  let html=`<div class="info-table">`;

  Object.entries(info).forEach(([k,v])=>{

    html+=`
    <div class="info-row">
      <div class="info-key">${k}</div>
      <div class="info-value">${v}</div>
    </div>`;

  });

  html+=`</div>`;

  return html;

}


function renderGallery(entity){

  const galleryContainer=document.getElementById("galleryContainer");

  if(!entity.gallery) return;

  galleryContainer.innerHTML=`

  <div class="gallery-container">

  <h2>Gallery</h2>

  <div class="gallery-grid">

  ${entity.gallery.map(img=>`<img src="${img}">`).join("")}

  </div>

  </div>

  `;

}


function formatName(str){

  return str
  .replace(/_/g," ")
  .replace(/\b\w/g,c=>c.toUpperCase())
  .replace("Countries","")
  .trim();

}