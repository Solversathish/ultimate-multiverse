document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const galleryContainer = document.getElementById("galleryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");

  const params = new URLSearchParams(window.location.search);
  const universe = params.get("universe");
  const entityId = params.get("id");

  if (!universe || !entityId) {
    container.innerHTML = "Invalid entity";
    return;
  }

  let entity = null;

  try {

    /* ================= FRUITS ================= */

    if (universe === "fruits") {

      const data = await fetch(`data/fruits/fruits.json`)
        .then(res => res.json());

      entity = data.find(item => item.id === entityId);

    }

    /* ================= OTHER UNIVERSES ================= */

    else {

      const categories = await fetch(`data/${universe}/categories.json`)
        .then(res => res.json());

      for (let cat of categories) {

        try {

          const level1 = await fetch(`data/${universe}/${cat.id}.json`)
            .then(res => res.json());

          /* SEARCH ENTITY DIRECTLY */
          entity = level1.find(item => item.id === entityId);
          if (entity) break;

          /* SEARCH LEVEL 2 FILES */
          for (let sub of level1) {

            if (sub.type !== "category") continue;

            try {

              const level2 = await fetch(`data/${universe}/${sub.id}.json`)
                .then(res => res.json());

              entity = level2.find(item => item.id === entityId);

              if (entity) break;

            } catch {}

          }

          if (entity) break;

        } catch {}

      }

    }

    if (!entity) {
      container.innerHTML = "Entity not found";
      return;
    }

    createBreadcrumbs(universe, entity);
    renderEntity(entity);
    renderGallery(entity);

  } catch (error) {

    console.error(error);
    container.innerHTML = "Error loading entity";

  }

});


/* ================= BREADCRUMBS ================= */

function createBreadcrumbs(universe, entity) {

  const breadcrumbs = document.getElementById("breadcrumbs");
  if (!breadcrumbs) return;

  const params = new URLSearchParams(window.location.search);
  const path = params.get("path");

  let breadcrumbHTML =
  `<a href="home.html">Home</a> >
   <a href="category.html?universe=${universe}">
   ${capitalize(universe)}
   </a>`;

  if (path && path.length > 0) {

    const levels = path.split(",");
    let accumulatedPath = "";

    levels.forEach((level, index) => {

      accumulatedPath = levels.slice(0, index + 1).join(",");

      breadcrumbHTML += `
      > <a href="category.html?universe=${universe}&path=${accumulatedPath}">
      ${level.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
      </a>`;

    });

  }

  breadcrumbHTML += ` > <span>${entity.name}</span>`;

  breadcrumbs.innerHTML = breadcrumbHTML;

}

/* ================= ENTITY MAIN ================= */

function renderEntity(entity) {

  const container = document.getElementById("entityContainer");

  const tabs = [];
  const contents = {};

  if(entity.description){
    tabs.push("Description");
    contents["Description"] = entity.description;
  }

  if(entity.powers){
    tabs.push("Powers");
    contents["Powers"] = entity.powers;
  }

  if(entity.extra){
    tabs.push("Extra");
    contents["Extra"] = entity.extra;
  }

  if(entity.biography){
    tabs.push("Biography");
    contents["Biography"] = entity.biography;
  }

  if(entity.benefits){
    tabs.push("Benefits");
    contents["Benefits"] = entity.benefits.join("<br>");
  }

  if(entity.achievements){
    tabs.push("Achievements");
    contents["Achievements"] = entity.achievements.join("<br>");
  }

  const tabButtons = tabs.map((tab,i)=>`
  <button class="tab-btn ${i===0?"active":""}" data-tab="${tab}">
  ${tab}
  </button>
  `).join("");

  const firstContent = contents[tabs[0]] || "";

  container.innerHTML = `

  <div class="entity-main">

    <div class="entity-hero">
      <img src="${entity.heroImage || entity.thumbnail || ''}">
    </div>

    <div class="entity-details">

      <h1 class="entity-name">${entity.name}</h1>

      ${generateInfoTable(entity.info)}

      <div class="tab-buttons">
        ${tabButtons}
      </div>

      <div class="tab-content" id="tabContent">
        ${firstContent}
      </div>

    </div>

  </div>

  `;

  setupTabs(contents);

}


/* ================= INFO TABLE ================= */

function generateInfoTable(info){

  if(!info) return "";

  let html = `<div class="info-table">`;

  Object.entries(info).forEach(([key,value]) => {

    html += `
      <div class="info-row">
        <div class="info-key">${key}</div>
        <div class="info-value">${value}</div>
      </div>
    `;

  });

  html += `</div>`;

  return html;

}


/* ================= GALLERY ================= */

function renderGallery(entity){

  const galleryContainer = document.getElementById("galleryContainer");

  if(!entity.gallery) return;

  galleryContainer.innerHTML = `

  <div class="gallery-container">

  <h2>Gallery</h2>

  <div class="gallery-grid">

  ${entity.gallery.map(img=>`
  <img src="${img}">
  `).join("")}

  </div>

  </div>

  `;

}


/* ================= TABS ================= */

function setupTabs(contents){

  const buttons = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("tabContent");

  buttons.forEach(btn=>{

    btn.addEventListener("click",()=>{

      buttons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;

      content.innerHTML = contents[tab];

    });

  });

}


/* ================= HELPER ================= */

function capitalize(str){
  return str.charAt(0).toUpperCase()+str.slice(1);
}

function formatName(str){

  return str
    .replace(/_/g," ")
    .replace(/\b\w/g,c=>c.toUpperCase())
    .replace("Countries","")
    .trim();

}