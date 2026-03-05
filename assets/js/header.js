document.addEventListener("DOMContentLoaded", () => {

  fetch("components/header.html")
    .then(res => res.text())
    .then(data => {

      document.getElementById("headerContainer").innerHTML = data;

      // Start search AFTER header loads
      if (window.initSearch) {
        window.initSearch();
      }

    });

});