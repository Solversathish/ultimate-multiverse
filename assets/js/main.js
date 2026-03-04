document.addEventListener("DOMContentLoaded", async () => {

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchBox = document.querySelector(".search-box");

  if (!searchInput) return;

  let searchDatabase = [];

  try {

    // LOAD UNIVERSES LIST
    const universes = await fetch("data/universes.json")
      .then(res => res.json());

    // LOOP THROUGH UNIVERSes
    for (let universe of universes) {

      // ADD UNIVERSE ITSELF
      searchDatabase.push({
        name: universe.name,
        type: "universe",
        image: universe.image,
        universe: universe.id,
        id: universe.id
      });

      // LOAD UNIVERSE DATABASE
      const data = await fetch(`data/${universe.id}.json`)
        .then(res => res.json());

      data.forEach(item => {

        searchDatabase.push({
          name: item.name,
          type: item.type,
          image: item.image || item.thumbnail,
          universe: universe.id,
          id: item.id,
          parent: item.parent
        });

      });

    }

  } catch (err) {
    console.error("Search database error:", err);
  }


  // ================= SEARCH INPUT =================
  searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = "";

    if (!value) {
      searchResults.style.display = "none";
      return;
    }

    const filtered = searchDatabase.filter(item =>
      item.name.toLowerCase().includes(value)
    );

    filtered.slice(0, 10).forEach(item => {

      const div = document.createElement("div");
      div.className = "search-item";

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <div>${item.name}</div>
          <div class="search-type">${item.type}</div>
        </div>
      `;

      div.addEventListener("click", () => {

        // ENTITY PAGE
        if (item.type === "entity") {

          window.location.href =
            `entity.html?universe=${item.universe}&id=${item.id}`;

        }

        // UNIVERSE PAGE
        else if (item.type === "universe") {

          window.location.href =
            `category.html?universe=${item.id}`;

        }

        // WORLD / SUBWORLD
        else {

          window.location.href =
            `category.html?universe=${item.universe}&path=${item.id}`;

        }

      });

      searchResults.appendChild(div);

    });

    searchResults.style.display =
      filtered.length > 0 ? "block" : "none";

  });


  // ================= CLICK OUTSIDE CLOSE =================
  document.addEventListener("click", (event) => {

    if (!searchBox.contains(event.target)) {
      searchResults.style.display = "none";
    }

  });

});