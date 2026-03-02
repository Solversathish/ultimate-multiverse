// LOAD UNIVERSes (home page only)
const grid = document.getElementById("gridContainer");

if (grid) {
  fetch("data/universes.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(universe => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="image-wrapper">
            <img src="${universe.image}" loading="lazy" alt="${universe.name}">
          </div>
          <div class="card-title">${universe.name}</div>
        `;
        card.addEventListener("click", () => {
          window.location.href = `universe.html?universe=${universe.id}`;
        });
        grid.appendChild(card);
      });
    });
}

// GLOBAL SEARCH
let searchData = [];

fetch("data/search-data.json")
  .then(res => res.json())
  .then(data => searchData = data);

const searchInput = document.getElementById("searchInput");
const resultsBox = document.getElementById("searchResults");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    resultsBox.innerHTML = "";

    if (!value) {
      resultsBox.style.display = "none";
      return;
    }

    const matches = searchData.filter(item =>
      item.name.toLowerCase().includes(value)
    );

    matches.slice(0, 6).forEach(item => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `
        <img src="${item.image}">
        <div>
          <div>${item.name}</div>
          <div class="search-type">${item.type}</div>
        </div>
      `;
      div.onclick = () => window.location.href = item.url;
      resultsBox.appendChild(div);
    });

    resultsBox.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
      resultsBox.style.display = "none";
    }
  });
}