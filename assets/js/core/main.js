window.CDN_BASE =
"https://res.cloudinary.com/do6nej9li/image/upload/";


window.getCDNImage = function(id, type="thumb", universe="", path=""){

  const base = "ultimate-multiverse";

  const HERO_TRANSFORM = "f_auto,q_auto,c_fit,w_600,h_600,b_transparent/";
  const THUMB_TRANSFORM = "f_auto,q_auto,c_fit,w_300,h_300/";
  const GALLERY_TRANSFORM = "f_auto,q_auto/";

  /* ================= HOME ================= */

  if(!universe){

    if(type === "hero"){
      return `${window.CDN_BASE}${HERO_TRANSFORM}${base}/${id}/${id}_hero.png`;
    }

    return `${window.CDN_BASE}${THUMB_TRANSFORM}${base}/${id}/thumb.png`;
  }

  /* ================= UNIVERSE ================= */

  if(id === universe){

    if(type === "hero"){
      return `${window.CDN_BASE}${HERO_TRANSFORM}${base}/${universe}/${universe}_hero.png`;
    }

    return `${window.CDN_BASE}${THUMB_TRANSFORM}${base}/${universe}/thumb.png`;
  }

  /* ================= PATH ================= */

  let folder = `${base}/${universe}`;

  if(path){
    path.split(",").forEach(level => folder += `/${level}`);
  }

  folder += `/${id}`;

  /* ================= TYPES ================= */

  if(type === "hero"){
    return `${window.CDN_BASE}${HERO_TRANSFORM}${folder}/${id}_hero.png`;
  }

  if(type === "gallery"){
    return `${window.CDN_BASE}${GALLERY_TRANSFORM}${folder}/${id}_`;
  }

  return `${window.CDN_BASE}${THUMB_TRANSFORM}${folder}/thumb.png`;

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
        : getCDNImage(item.id,"thumb",item.universe,item.path);

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