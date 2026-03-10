/* ================= CDN BASE ================= */

window.CDN_BASE =
"https://res.cloudinary.com/do6nej9li/image/upload/f_auto,q_auto/";


/* ================= IMAGE GENERATOR ================= */

window.getCDNImage = function(path,type="thumb"){

  if(type === "hero"){

    return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_600,h_600,b_transparent/ultimate-multiverse/${path}/hero.png`;

  }

  return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_300,h_300/ultimate-multiverse/${path}/thumb.png`;

};


/* ================= SEARCH SYSTEM ================= */

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

      /* AUTO CDN IMAGE */

      const imagePath = item.image
        ? item.image
        : getCDNImage(item.id,"thumb");

      div.innerHTML = `
        <img src="${imagePath}">
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