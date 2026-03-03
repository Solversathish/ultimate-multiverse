document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("homeContainer");

  const universes = await fetch("data/universes.json")
    .then(res => res.json());

  universes.forEach(universe => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${universe.image}">
      </div>
      <div class="card-title">${universe.name}</div>
    `;

    card.addEventListener("click", () => {
      window.location.href =
        `category.html?universe=${universe.id}`;
    });

    container.appendChild(card);

  });

});