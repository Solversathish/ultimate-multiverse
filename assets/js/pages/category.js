document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("categoryContainer");
const breadcrumbs = document.getElementById("breadcrumbs");
const countElement = document.getElementById("categoryCount");
const alphabetBar = document.getElementById("alphabetBar");
const toggleBtn = document.getElementById("toggleImages");
const sortSelect = document.getElementById("filterSelect");

if (!container) return;

const params = new URLSearchParams(window.location.search);
const universe = params.get("universe");
const path = params.get("path");

if (!universe) {
container.innerHTML = "Universe not specified";
return;
}

const levels = path ? path.split(",") : [];

let filePath;

/* ================= FILE PATH ================= */

if (levels.length === 0) {

if (universe === "fruits") {
filePath = `data/fruits/fruits.json`;
} else {
filePath = `data/${universe}/categories.json`;
}

} else {

const lastLevel = levels[levels.length - 1];
filePath = `data/${universe}/${lastLevel}.json`;

}

let items = [];

try {

items = await fetch(filePath).then(res => res.json());

} catch (err) {

console.error(err);
container.innerHTML = "Data not found";
return;

}

if (!items || items.length === 0) {
container.innerHTML = "No items found";
return;
}

/* ================= BREADCRUMBS ================= */

let breadcrumbHTML = `<a href="home.html">Home</a> > `;

if(levels.length === 0){

breadcrumbHTML += `<span>${capitalize(universe)}</span>`;

}
else{

breadcrumbHTML += `
<a href="category.html?universe=${universe}">
${capitalize(universe)}
</a>`;

}

let accumulatedPath = "";

levels.forEach((level, index) => {

accumulatedPath = levels.slice(0, index + 1).join(",");

if (index === levels.length - 1) {

breadcrumbHTML += ` > <span>${formatName(level)}</span>`;

} else {

breadcrumbHTML += `
> <a href="category.html?universe=${universe}&path=${accumulatedPath}">
${formatName(level)}
</a>`;

}

});

breadcrumbs.innerHTML = breadcrumbHTML;


/* ================= PAGINATION ================= */

let currentPage = 1;
const itemsPerPage = 60;
let filteredItems = items;

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

if(countElement)
countElement.textContent = `0 Items`;

return;
}

const start = (currentPage - 1) * itemsPerPage;
const end = start + itemsPerPage;

const pageItems = filteredItems.slice(start, end);

pageItems.forEach(item => {

const card = document.createElement("div");
card.className = "card";
card.id = item.id;

card.innerHTML = `
<div class="image-wrapper">
<img src="${getCDNImage(item.id, 'thumb', universe, path || '')}" loading="lazy">
</div>
<div class="card-title">${item.name}</div>
`;

card.addEventListener("click", () => {

if (item.type === "entity") {

window.location.href =
`entity.html?universe=${universe}&path=${path || ""}&id=${item.id}`;

} else {

let newPath;

if (path) {
newPath = path + "," + item.id;
} else {
newPath = item.id;
}

window.location.href =
`category.html?universe=${universe}&path=${newPath}`;

}

});

container.appendChild(card);

});

}


/* ================= PAGINATION ================= */

function createPagination() {

let pagination = document.getElementById("pagination");

if (!pagination) {

pagination = document.createElement("div");
pagination.id = "pagination";
pagination.className = "pagination";
container.after(pagination);

}

pagination.innerHTML = "";

const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

for (let i = 1; i <= totalPages; i++) {

const btn = document.createElement("button");
btn.textContent = i;

if (i === currentPage)
btn.classList.add("active-page");

btn.addEventListener("click", () => {

currentPage = i;
renderPage();
createPagination();

window.scrollTo({top:0,behavior:"smooth"});

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

filteredItems = items;

}else{

filteredItems = items.filter(item =>
item.name.toUpperCase().startsWith(letter)
);

}

currentPage = 1;

if(countElement)
countElement.textContent = `${filteredItems.length} Items`;

renderPage();
createPagination();

};

alphabetBar.appendChild(btn);

});

}


/* ================= INIT ================= */

renderPage();
createPagination();
generateAlphabet(items);

countElement.textContent = `${items.length} Items`;


/* ================= SORT ================= */

sortSelect?.addEventListener("change", () => {

if (sortSelect.value === "az")
filteredItems.sort((a,b)=>a.name.localeCompare(b.name));

if (sortSelect.value === "za")
filteredItems.sort((a,b)=>b.name.localeCompare(a.name));

currentPage = 1;
renderPage();
createPagination();

});


/* ================= TOGGLE IMAGES ================= */

toggleBtn?.addEventListener("click", () => {

container.classList.toggle("hide-images");

toggleBtn.textContent =
container.classList.contains("hide-images")
? "Show Images"
: "Hide Images";

});

});


function capitalize(str){
return str.charAt(0).toUpperCase()+str.slice(1);
}

function formatName(str){
return str
.replace(/_/g," ")
.replace(/\b\w/g,c=>c.toUpperCase())
.trim();
}