// ================= GET WORLD ID =================
const params = new URLSearchParams(window.location.search);
const worldId = params.get("world");

// ================= ELEMENTS =================
const breadcrumbs = document.getElementById("breadcrumbs");
const container = document.getElementById("worldContainer");
const worldCount = document.getElementById("worldCount");
const filterSelect = document.getElementById("filterSelect");
const toggleBtn = document.getElementById("toggleImages");
const alphabetBar = document.getElementById("alphabetBar");

let allEntities = [];

// ================= LOAD DATA =================
Promise.all([
  fetch("data/entities.json").then(res => res.json()),
  fetch("data/worlds.json").then(res => res.json())
])
.then(([entities, worlds]) => {

  const currentWorld = worlds.find(w => w.id === worldId);
  if (!currentWorld) return;

  // Breadcrumbs
  breadcrumbs.innerHTML = `
    <a href="home.html">Home</a> > 
    <a href="universe.html?universe=${currentWorld.universe}">
      ${currentWorld.universe}
    </a> > 
    ${currentWorld.name}
  `;

  // Filter entities
  allEntities = entities.filter(e => e.world === worldId);

  render(allEntities);
})
.catch(err => console.log("World page error:", err));


// ================= RENDER =================
function render(data) {

  container.innerHTML = "";

  data.forEach(entity => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${entity.image}" loading="lazy" alt="${entity.name}">
      </div>
      <div class="card-title">${entity.name}</div>
    `;

    card.addEventListener("click", () => {
    window.location.href = `entity.html?id=${entity.id}`;
    });

    container.appendChild(card);
  });

  worldCount.textContent = `${data.length} Items`;
}


// ================= SORT =================
filterSelect.addEventListener("change", (e) => {

  let sorted = [...allEntities];

  if (e.target.value === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (e.target.value === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }

  render(sorted);
});


// ================= TOGGLE IMAGES =================
toggleBtn.addEventListener("click", () => {

  container.classList.toggle("hide-images");

  toggleBtn.textContent =
    container.classList.contains("hide-images")
      ? "Show Images"
      : "Hide Images";
});


// ================= ALPHABET =================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

letters.forEach(letter => {

  const btn = document.createElement("button");
  btn.className = "alphabet-btn";
  btn.textContent = letter;

  btn.addEventListener("click", () => {
    scrollToLetter(letter);
  });

  alphabetBar.appendChild(btn);
});

function scrollToLetter(letter) {

  const cards = document.querySelectorAll(".card");

  for (let card of cards) {

    const title = card.querySelector(".card-title").textContent;

    if (title.toUpperCase().startsWith(letter)) {

      card.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      break;
    }
  }
}