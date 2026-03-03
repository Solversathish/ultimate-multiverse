document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("categoryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("categoryCount");
  const alphabetBar = document.getElementById("alphabetBar");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || params.get("parent");

  if (!id) return;

  let data = [];

  try {

  const universesRes = await fetch("data/universes.json");
  if (!universesRes.ok) throw new Error("universes.json not found");
  const universes = await universesRes.json();

  console.log("Universes:", universes);

  const universeMatch = universes.find(u => u.id === id);

  // ===== If ID is a Universe =====
  if (universeMatch) {

    const worldsRes = await fetch(`data/${id}/worlds.json`);
    if (!worldsRes.ok) throw new Error("worlds.json not found");

    data = await worldsRes.json();

    console.log("Loaded worlds:", data);

    breadcrumbs.innerHTML =
      `<a href="home.html">Home</a> > ${universeMatch.name}`;
  }

  // ===== If ID is a World =====
  else {

    for (let universe of universes) {

      const worldsRes = await fetch(`data/${universe.id}/worlds.json`);
      if (!worldsRes.ok) continue;

      const worlds = await worldsRes.json();
      const worldMatch = worlds.find(w => w.id === id);

      if (worldMatch) {

        const entityRes = await fetch(`data/${universe.id}/${id}.json`);
        if (!entityRes.ok) throw new Error(`${id}.json not found`);

        data = await entityRes.json();

        console.log("Loaded entities:", data);

        breadcrumbs.innerHTML = `
          <a href="home.html">Home</a> >
          <a href="category.html?id=${universe.id}">${universe.name}</a> >
          ${worldMatch.name}
        `;

        break;
      }
    }
  }

  if (!data || data.length === 0) {
    console.warn("Data is empty!");
  }

  render(data);
  generateAlphabet(data);
  updateCount(data.length);
  }
  catch (error) {
  console.error("Category error:", error);
}
});