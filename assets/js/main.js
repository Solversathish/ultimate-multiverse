window.initSearch = async function () {

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchBox = document.querySelector(".search-box");

  if (!searchInput) return;

  let searchDatabase = [];

  try {

    const res = await fetch("data/search-data.json");
    searchDatabase = await res.json();

  } catch (err) {

    console.error("Search data error:", err);

  }

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

    filtered.slice(0,10).forEach(item => {

      const div = document.createElement("div");
      div.className = "search-item";

      div.innerHTML = `
        <img src="${item.image}">
        <div>
          <div>${item.name}</div>
          <div class="search-type">${item.type}</div>
        </div>
      `;

      div.onclick = () => {
        window.location.href = item.url;
      };

      searchResults.appendChild(div);

    });

    searchResults.style.display =
      filtered.length > 0 ? "block" : "none";

  });

  document.addEventListener("click", (event) => {

    if (!searchBox.contains(event.target)) {
      searchResults.style.display = "none";
    }

  });

};