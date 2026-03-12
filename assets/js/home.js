document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("homeContainer");
  const countElement = document.getElementById("homeCount");

  const alphabetBar = document.getElementById("alphabetBar");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  const modal = document.getElementById("universeModal");
  const modalTitle = document.getElementById("modalTitle");

  const aboutBtn = document.getElementById("aboutBtn");
  const listBtn = document.getElementById("listBtn");

  const closeBtn = document.querySelector(".modal-close");

  let currentUniverse = "";

  let universes = [];
  let filteredItems = [];

  try {

    universes = await fetch("data/universes.json")
      .then(res => res.json());

    filteredItems = universes;

  } catch (err) {

    console.error("Universe load error", err);

  }

  let currentPage = 1;
  const itemsPerPage = 60;

  /* ================= POPUP OPEN ================= */

  function openUniverseModal(universeId, universeName){

    currentUniverse = universeId;

    modalTitle.textContent = universeName;

    modal.style.display = "flex";

  }

  /* ================= POPUP CLOSE ================= */

  closeBtn.onclick = () => modal.style.display = "none";

  window.onclick = (e)=>{
    if(e.target === modal){
      modal.style.display = "none";
    }
  }

  /* ================= BUTTON ACTIONS ================= */

  aboutBtn.onclick = ()=>{

    window.location.href =
    `entity.html?universe=${currentUniverse}&id=${currentUniverse}`;

  }

  listBtn.onclick = ()=>{

    window.location.href =
    `category.html?universe=${currentUniverse}`;

  }

  /* ================= RENDER ================= */

  function renderPage() {

  container.innerHTML = "";

  /* NO ITEMS MESSAGE */

  if(filteredItems.length === 0){

    container.innerHTML = `
      <div class="no-items">
        No items found for this alphabet
      </div>
    `;

    const pagination = document.getElementById("pagination");
    if(pagination) pagination.innerHTML = "";

    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = filteredItems.slice(start, end);

  pageItems.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${getCDNImage(item.id,"thumb")}" loading="lazy">
      </div>
      <div class="card-title">${item.name}</div>
    `;

    card.addEventListener("click", () => {

      openUniverseModal(item.id, item.name);

    });

    container.appendChild(card);

  });

}

  /* ================= PAGINATION ================= */

  function createPagination() {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages =
      Math.ceil(filteredItems.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {

      const btn = document.createElement("button");

      btn.textContent = i;

      if (i === currentPage)
        btn.classList.add("active-page");

      btn.addEventListener("click", () => {

        currentPage = i;

        renderPage();
        createPagination();

        window.scrollTo({
          top:0,
          behavior:"smooth"
        });

      });

      pagination.appendChild(btn);

    }

  }

  /* ================= ALPHABET FILTER ================= */

  function generateAlphabet(items){

    if(!alphabetBar) return;

    alphabetBar.innerHTML = "";

    const letters = ["All", ... "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

    letters.forEach(letter => {

      const btn = document.createElement("button");
      btn.className = "alphabet-btn";
      btn.textContent = letter;

      btn.onclick = () => {

  document.querySelectorAll(".alphabet-btn")
  .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  if(letter === "All"){

    filteredItems = universes;

  }else{

    filteredItems = universes.filter(item =>
      item.name.toUpperCase().startsWith(letter)
    );

  }

  currentPage = 1;

  /* UPDATE COUNT */
  if(countElement){
    countElement.textContent = `${filteredItems.length} items`;
  }

  renderPage();
  createPagination();

};

      alphabetBar.appendChild(btn);

    });

  }

  /* ================= SORT ================= */

  sortSelect?.addEventListener("change", () => {

    if(sortSelect.value === "az")
      filteredItems.sort((a,b)=>a.name.localeCompare(b.name));

    if(sortSelect.value === "za")
      filteredItems.sort((a,b)=>b.name.localeCompare(a.name));

    renderPage();

  });

  /* ================= TOGGLE IMAGES ================= */

  toggleBtn?.addEventListener("click", () => {

    container.classList.toggle("hide-images");

    toggleBtn.textContent =
    container.classList.contains("hide-images")
    ? "Show Images"
    : "Hide Images";

  });

  /* ================= INIT ================= */

  renderPage();
  createPagination();
  generateAlphabet(universes);

  if (countElement)
    countElement.textContent = `${universes.length} items`;

});