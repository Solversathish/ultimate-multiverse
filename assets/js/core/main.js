/* ================= CDN BASE ================= */

window.CDN_BASE =
"https://res.cloudinary.com/do6nej9li/image/upload/";

/* ================= IMAGE BUILDER ================= */

window.getCDNImage = function(id, type="thumb", universe="", path=""){

  const base = "ultimate-multiverse";

  const HERO = "f_auto,q_auto,c_fit,w_900,h_900,b_transparent/";
  const THUMB = "f_auto,q_auto,c_fit,w_900,h_900/";
  const GALLERY = "f_auto,q_auto/";

  /* HOME LEVEL */
  if(!universe){
    return type === "hero"
      ? `${CDN_BASE}${HERO}${base}/${id}/${id}_hero.png`
      : `${CDN_BASE}${THUMB}${base}/${id}/${id}_thumb.png`;
  }

  /* UNIVERSE LEVEL */
  if(id === universe){
    return type === "hero"
      ? `${CDN_BASE}${HERO}${base}/${universe}/${universe}_hero.png`
      : `${CDN_BASE}${THUMB}${base}/${universe}/thumb.png`;
  }

  /* MULTI-LEVEL PATH SUPPORT (ALL 4 LEVELS) */
  let folder = `${base}/${universe}`;

  if(path){
    path.split(",").forEach(level => {
      if(level.trim()){
        folder += `/${level.trim()}`;
      }
    });
  }

  folder += `/${id}`;

  /* TYPES */
  if(type === "hero"){
    return `${CDN_BASE}${HERO}${folder}/${id}_hero.png`;
  }

  if(type === "gallery"){
    return `${CDN_BASE}${GALLERY}${folder}/${id}_`;
  }

  return `${CDN_BASE}${THUMB}${folder}/${id}_thumb.png`;
};


/* ================= SLUG SYSTEM (SEO READY) ================= */

function slugify(name){
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


/* ================= OPTIONAL CLEAN URL BUILDER ================= */
/* (Does NOT break your current system) */

window.getCleanURL = function(item){
  const slug = slugify(item.name);

  let url = `/${item.universe}`;

  if(item.path){
    item.path.split(",").forEach(level=>{
      url += `/${level}`;
    });
  }

  url += `/${slug}`;

  return url;
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

      /* IMAGE */
      const imagePath = item.image
        ? item.image
        : getCDNImage(item.id,"thumb",item.universe,item.path);

      /* UI */
      div.innerHTML = `
        <img src="${imagePath}">
        <div>
          <div>${item.name}</div>
          <div class="search-type">${item.type || ""}</div>
        </div>
      `;

      /* NAVIGATION (SAFE FOR YOUR CURRENT SYSTEM) */
      div.onclick = () => {

        // CURRENT (WORKING)
        window.location.href = item.url;

        // FUTURE (SEO CLEAN URL)
        // window.location.href = getCleanURL(item);

      };

      searchResults.appendChild(div);

    });

    searchResults.style.display =
      filtered.length > 0 ? "block" : "none";

  });

  /* CLICK OUTSIDE CLOSE */
  document.addEventListener("click", (event) => {
    if (!searchBox.contains(event.target)) {
      searchResults.style.display = "none";
    }
  });

};


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
});