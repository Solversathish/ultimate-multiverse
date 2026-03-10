document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("homeContainer");
  const countElement = document.getElementById("homeCount");

  const modal = document.getElementById("universeModal");
  const modalTitle = document.getElementById("modalTitle");

  const aboutBtn = document.getElementById("aboutBtn");
  const listBtn = document.getElementById("listBtn");

  const closeBtn = document.querySelector(".modal-close");

  let currentUniverse = "";

  let universes = [];

  try {

    universes = await fetch("data/universes.json")
      .then(res => res.json());

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



  /* ================= RENDER UNIVERSES ================= */

  function renderPage() {

    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageItems = universes.slice(start, end);

    pageItems.forEach(item => {

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${getCDNImage(item.id,"thumb")}">
        </div>
        <div class="card-title">${item.name}</div>
      `;

      /* OPEN POPUP */

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
      Math.ceil(universes.length / itemsPerPage);

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



  /* ================= INIT ================= */

  renderPage();
  createPagination();

  if (countElement)
    countElement.textContent = `${universes.length} items`;

});