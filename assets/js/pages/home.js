document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("homeContainer");
const countElement = document.getElementById("homeCount");

const alphabetBar = document.getElementById("alphabetBar");
const toggleBtn = document.getElementById("toggleImages");
const sortSelect = document.getElementById("filterSelect");

let universes = [];
let filteredItems = [];

try {
universes = await fetch("data/universes.json").then(r=>r.json());
filteredItems = universes;
}catch(err){
console.error(err);
}

let currentPage = 1;
const itemsPerPage = 60;


/* ================= RENDER ================= */

function renderPage(){

container.innerHTML = "";

if(filteredItems.length === 0){

container.innerHTML = `
<div class="no-items">
No items found
</div>
`;

return;

}

const start = (currentPage-1)*itemsPerPage;
const end = start + itemsPerPage;

const pageItems = filteredItems.slice(start,end);

pageItems.forEach(item=>{

const card = document.createElement("div");
card.className="card";

card.innerHTML=`
<div class="image-wrapper">
<img src="${getCDNImage(item.id,"thumb")}" loading="lazy">
</div>
<div class="card-title">${item.name}</div>
`;

card.addEventListener("click",()=>{

window.location.href =
`category.html?universe=${item.id}`;

});

container.appendChild(card);

});

}


/* ================= PAGINATION ================= */

function createPagination(){

const pagination = document.getElementById("pagination");

pagination.innerHTML="";

const totalPages =
Math.ceil(filteredItems.length/itemsPerPage);

for(let i=1;i<=totalPages;i++){

const btn = document.createElement("button");
btn.textContent = i;

if(i===currentPage)
btn.classList.add("active-page");

btn.onclick=()=>{

currentPage=i;
renderPage();
createPagination();

window.scrollTo({
top:0,
behavior:"smooth"
});

};

pagination.appendChild(btn);

}

}


/* ================= ALPHABET FILTER ================= */

function generateAlphabet(){

alphabetBar.innerHTML="";

const letters=["All",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

letters.forEach(letter=>{

const btn=document.createElement("button");
btn.className="alphabet-btn";
btn.textContent=letter;

btn.onclick=()=>{

document.querySelectorAll(".alphabet-btn")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

if(letter==="All"){
filteredItems=universes;
}else{
filteredItems = universes.filter(i =>
i.name.toUpperCase().startsWith(letter)
);
}

currentPage=1;

countElement.textContent =
`${filteredItems.length} items`;

renderPage();
createPagination();

};

alphabetBar.appendChild(btn);

});

}


/* ================= SORT ================= */

sortSelect?.addEventListener("change",()=>{

if(sortSelect.value==="az")
filteredItems.sort((a,b)=>a.name.localeCompare(b.name));

if(sortSelect.value==="za")
filteredItems.sort((a,b)=>b.name.localeCompare(a.name));

renderPage();

});


/* ================= TOGGLE ================= */

toggleBtn?.addEventListener("click",()=>{

container.classList.toggle("hide-images");

toggleBtn.textContent =
container.classList.contains("hide-images")
? "Show Images"
: "Hide Images";

});


/* ================= INIT ================= */

renderPage();
createPagination();
generateAlphabet();

if(countElement)
countElement.textContent =
`${universes.length} items`;

});