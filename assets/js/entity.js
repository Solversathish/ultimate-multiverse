const params = new URLSearchParams(window.location.search);
const entityId = params.get("id");

const container = document.getElementById("entityPage");

fetch("data/entities.json")
  .then(res => res.json())
  .then(data => {

    const entity = data.find(e => e.id === entityId);

    if (!entity) {
      container.innerHTML = "<h2>Entity Not Found</h2>";
      return;
    }

    container.innerHTML = `
      <div class="card">
        <div class="image-wrapper">
          <img src="${entity.heroImage}" loading="lazy" alt="${entity.name}">
        </div>
        <div class="card-title">${entity.name}</div>
      </div>
    `;
  });