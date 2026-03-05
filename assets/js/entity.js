document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const galleryContainer = document.getElementById("galleryContainer");

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const entityId = params.get("id");

  if (!universeId || !entityId) {
    container.innerHTML = "<p style='color:white'>Invalid entity.</p>";
    return;
  }

  try {

    const database = await fetch(`data/${universeId}.json`)
      .then(res => res.json());

    const entity = database.find(item => item.id === entityId);

    if (!entity) {
      container.innerHTML = "<p style='color:white'>Entity not found.</p>";
      return;
    }

    renderEntity(entity);
    renderGallery(entity);

  } catch (error) {

    console.error(error);
    container.innerHTML = "<p style='color:white'>Error loading entity.</p>";

  }

});



/* ================= ENTITY MAIN ================= */

function renderEntity(entity) {

  const container = document.getElementById("entityContainer");

  container.innerHTML = `

  <div class="entity-main">

    <div class="entity-hero">
      <img src="${entity.heroImage || entity.thumbnail || entity.image || ''}">
    </div>

    <div class="entity-details">

      <h1 class="entity-name">${entity.name}</h1>

      ${generateInfoTable(entity.info)}

      <div class="tab-buttons">

        <button class="tab-btn active" data-tab="desc">
        Description
        </button>

        <button class="tab-btn" data-tab="powers">
        Abilities
        </button>

        <button class="tab-btn" data-tab="extra">
        Extra
        </button>

      </div>

      <div class="tab-content" id="tabContent">
        ${entity.description || "No description available."}
      </div>

    </div>

  </div>

  `;

  setupTabs(entity);

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

  if(!galleryContainer) return;

  if(!entity.gallery || entity.gallery.length === 0){
    galleryContainer.innerHTML = "";
    return;
  }

  galleryContainer.innerHTML = `

  <div class="gallery-container">

    <h2>Gallery</h2>

    <div class="gallery-grid">

      ${entity.gallery.map(img => `
        <img src="${img}">
      `).join("")}

    </div>

  </div>

  `;

}



/* ================= TABS ================= */

function setupTabs(entity) {

  const buttons = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("tabContent");

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;

      if (tab === "desc")
        content.innerHTML = entity.description || "No description";

      if (tab === "powers")
        content.innerHTML = entity.powers || "No powers listed";

      if (tab === "extra")
        content.innerHTML = entity.extra || "No extra info";

    });

  });

}