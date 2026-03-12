/* ================= CDN BASE ================= */

window.CDN_BASE =
"https://res.cloudinary.com/do6nej9li/image/upload/";


/* ================= IMAGE GENERATOR ================= */

window.getCDNImage = function(id,type="thumb",universe="",path=""){

  let base = "ultimate-multiverse";

  /* HOME PAGE (UNIVERSE CARDS) */

  if(!universe){

    if(type === "hero"){
      return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_600,h_600,b_transparent/${base}/${id}/hero.png`;
    }

    return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_300,h_300/${base}/${id}/thumb.png`;
  }

  /* UNIVERSE ENTITY PAGE */

  if(id === universe){

    if(type === "hero"){
      return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_600,h_600,b_transparent/${base}/${universe}/hero.png`;
    }

    return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_300,h_300/${base}/${universe}/thumb.png`;
  }

  /* BUILD PATH */

  let folder = `${base}/${universe}`;

  if(path){
    const levels = path.split(",");
    levels.forEach(level => folder += `/${level}`);
  }

  folder += `/${id}`;

  if(type === "hero"){
    return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_600,h_600,b_transparent/${folder}/hero.png`;
  }

  return `${window.CDN_BASE}f_auto,q_auto,c_fit,w_300,h_300/${folder}/thumb.png`;
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