document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("homeContainer");
  const countElement = document.getElementById("homeCount");

  let universes = [];

  try {

    universes = await fetch("data/universes.json")
      .then(res => res.json());

  } catch (err) {

    console.error("Universe load error", err);

  }

  let currentPage = 1;
  const itemsPerPage = 60;

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
          <img src="${item.image}">
        </div>
        <div class="card-title">${item.name}</div>
      `;

      card.addEventListener("click", () => {

        window.location.href =
          `category.html?universe=${item.id}`;

      });

      container.appendChild(card);

    });

  }

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

  renderPage();
  createPagination();

  if (countElement)
    countElement.textContent = `${universes.length} items`;

});