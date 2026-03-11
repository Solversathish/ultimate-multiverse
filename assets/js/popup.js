let popupUniverse = "";
let popupPath = "";
let popupId = "";

document.addEventListener("DOMContentLoaded", () => {

  const popupContainer = document.getElementById("popupContainer");
  if (!popupContainer) return;

  fetch("components/popup.html")
  .then(res => res.text())
  .then(html => {

    popupContainer.innerHTML = html;

    const modal = document.getElementById("universeModal");
    const modalTitle = document.getElementById("modalTitle");
    const aboutBtn = document.getElementById("aboutBtn");
    const listBtn = document.getElementById("listBtn");
    const closeBtn = document.querySelector(".modal-close");


    /* OPEN POPUP */

    window.openPopup = function(title, universe, path){

      popupUniverse = universe;
      popupPath = path || "";

      if(popupPath){
        const levels = popupPath.split(",");
        popupId = levels[levels.length - 1];
      } else {
        popupId = universe;
      }

      modalTitle.textContent = title;
      modal.style.display = "flex";

    };


    /* CLOSE POPUP */

    closeBtn.onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = (e)=>{
      if(e.target === modal){
        modal.style.display = "none";
      }
    };


    /* ABOUT BUTTON */

    aboutBtn.onclick = () => {

      let entityPath = "";

      if(popupPath){

        const levels = popupPath.split(",");

        if(levels.length > 1){
          entityPath = levels.slice(0,-1).join(",");
        }

      }

      if(entityPath){

        window.location.href =
        `entity.html?universe=${popupUniverse}&path=${entityPath}&id=${popupId}`;

      }else{

        window.location.href =
        `entity.html?universe=${popupUniverse}&id=${popupId}`;

      }

    };


    /* VIEW LIST */

    listBtn.onclick = () => {

      if(popupPath){

        window.location.href =
        `category.html?universe=${popupUniverse}&path=${popupPath}`;

      } else {

        window.location.href =
        `category.html?universe=${popupUniverse}`;

      }

    };

  });

});