document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const galleryContainer = document.getElementById("galleryContainer");

  const params = new URLSearchParams(window.location.search);
  const universe = params.get("universe");
  const entityId = params.get("id");
  let path = params.get("path");

  if(!universe || !entityId){
    container.innerHTML="Invalid entity";
    return;
  }

  let entity = null;

  try{

    /* ================= UNIVERSE ENTITY ================= */

    const universeData = await fetch("data/universe_entities.json")
    .then(res=>res.json());

    if(universeData[universe] && entityId === universe){
      entity = universeData[universe];
    }

    /* ================= WORLD ENTITY ================= */

    if(!entity){

      const worldData = await fetch("data/world_entities.json")
      .then(res=>res.json());

      if(worldData[entityId]){
        entity = worldData[entityId];
      }

    }

    /* ================= SUBWORLD ENTITY ================= */

    if(!entity){

      const subworldData = await fetch("data/subworld_entities.json")
      .then(res=>res.json());

      if(subworldData[entityId]){
        entity = subworldData[entityId];

        if(!path && entity.path){
          path = entity.path;
        }
      }

    }

    /* ================= NORMAL ENTITY ================= */

    if(!entity){

      if(universe === "fruits"){

        const fruits = await fetch(`data/fruits/fruits.json`)
        .then(res=>res.json());

        entity = fruits.find(f=>f.id === entityId);

      }else{

        const categories = await fetch(`data/${universe}/categories.json`)
        .then(res=>res.json());

        for(const cat of categories){

          try{

            const level1 = await fetch(`data/${universe}/${cat.id}.json`)
            .then(res=>res.json());

            entity = level1.find(i=>i.id === entityId);

            if(entity) break;

            for(const sub of level1){

              if(sub.type !== "category") continue;

              try{

                const level2 = await fetch(`data/${universe}/${sub.id}.json`)
                .then(res=>res.json());

                entity = level2.find(i=>i.id === entityId);

                if(entity) break;

              }catch{}

            }

            if(entity) break;

          }catch{}

        }

      }

    }

  }catch(err){
    console.error(err);
  }

  if(!entity){
    container.innerHTML="Entity not found";
    return;
  }

  createBreadcrumbs(universe,entity,path);
  renderEntity(entity,universe,path);
  renderGallery(entity);
  buildNavigation(entityId);

  /* LOAD PREV NEXT AFTER ENTITY */
  loadPrevNext(universe,entityId,path);

});



/* ================= BREADCRUMBS ================= */

function createBreadcrumbs(universe, entity, forcedPath){

  const breadcrumbs = document.getElementById("breadcrumbs");

  const params = new URLSearchParams(window.location.search);
  const path = forcedPath || params.get("path");
  const entityId = params.get("id");

  let html = `<a href="home.html">Home</a> > `;

  if(entityId === universe){
    html += `<span>${formatName(universe)}</span>`;
  }else{
    html += `<a href="category.html?universe=${universe}">
    ${formatName(universe)}
    </a>`;
  }

  if(path){

    const levels = path.split(",");
    let accumulated = "";

    levels.forEach((level,index)=>{

      accumulated = levels.slice(0,index+1).join(",");

      html += ` > <a href="category.html?universe=${universe}&path=${accumulated}">
      ${formatName(level)}
      </a>`;

    });

  }

  if(entityId !== universe){
    html += ` > <span>${entity.name}</span>`;
  }

  breadcrumbs.innerHTML = html;

}



/* ================= ENTITY PAGE ================= */

function renderEntity(entity,universe,path){

  const container=document.getElementById("entityContainer");

  let viewListBtn = "";

  if(entity.type !== "entity"){

    const listURL = entity.id === universe
    ? `category.html?universe=${universe}`
    : `category.html?universe=${universe}&path=${path}`;

    viewListBtn = `
    <div class="view-list-wrapper">
      <button class="view-list-btn"
      onclick="window.location.href='${listURL}'">
      View Full List
      </button>
    </div>
    `;

  }

  container.innerHTML=`

  <div class="entity-main">

    <div class="entity-hero">
      <img src="${getCDNImage(entity.id,"hero",universe,path)}" loading="lazy">
    </div>

    <div class="entity-details">

      <h1 class="entity-name">${entity.name}</h1>

      ${generateInfoTable(entity.info)}

      <div class="tab-content">
        ${entity.description || ""}
      </div>

    </div>

  </div>

  ${viewListBtn}

  <div id="entityNavigation"></div>

  `;

}



/* ================= PREVIOUS NEXT ================= */

async function buildNavigation(entityId){

  const nav = document.getElementById("entityNavigation");

  let db = [];

  try{
    db = await fetch("data/search-data.json")
    .then(r=>r.json());
  }catch{
    return;
  }

  const index = db.findIndex(i => i.id === entityId);

  if(index === -1) return;

  const prev = db[index-1];
  const next = db[index+1];

  nav.innerHTML = `
  <div class="entity-navigation">

    ${prev ? `
    <button onclick="window.location.href='${prev.url}'">
    ← ${prev.name}
    </button>` : `<div></div>`}

    ${next ? `
    <button onclick="window.location.href='${next.url}'">
    ${next.name} →
    </button>` : `<div></div>`}

  </div>
  `;
}



/* ================= INFO TABLE ================= */

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



/* ================= GALLERY ================= */

function renderGallery(entity){

  const galleryContainer=document.getElementById("galleryContainer");

  if(!entity.gallery) return;

  galleryContainer.innerHTML=`

  <div class="gallery-container">

  <h2>Gallery</h2>

  <div class="gallery-grid">

  ${entity.gallery.map(img=>`<img src="${img}" loading="lazy">`).join("")}

  </div>

  </div>

  `;

}



/* ================= HELPERS ================= */

function formatName(str){

  return str
  .replace(/_/g," ")
  .replace(/\b\w/g,c=>c.toUpperCase())
  .replace("Countries","")
  .trim();

}