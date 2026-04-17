const fs = require("fs");

const dataFolder = "./data";
const searchData = [];

/* ================= HELPER ================= */

function formatName(str){
  return str
    .replace(/_/g," ")
    .replace(/\b\w/g,c=>c.toUpperCase());
}

/* ================= LOAD UNIVERSes ================= */

const universes = JSON.parse(
  fs.readFileSync(`${dataFolder}/universes.json`, "utf8")
);

/* ================= ADD UNIVERSes ================= */

universes.forEach(u => {

  searchData.push({
    name: u.name,
    id: u.id,
    type: "universe",
    universe: u.id,
    path: "",
    parent: "",
    url: `category.html?universe=${u.id}`
  });

});

/* ================= GET ROOT FILE ================= */

function getRootFile(universe){

  if (universe === "fruits") {
    return `${dataFolder}/fruits/fruits.json`;
  }

  if (universe === "mythical_creatures") {
    return `${dataFolder}/mythical_creatures/mythical_creatures.json`;
  }

  return `${dataFolder}/${universe}/categories.json`;
}

/* ================= RECURSIVE SCAN ================= */

function scan(universe, currentPath = "", parentName = "") {

  let filePath;

  if (currentPath === "") {
    filePath = getRootFile(universe);
  } else {
    const last = currentPath.split(",").pop();
    filePath = `${dataFolder}/${universe}/${last}.json`;
  }

  // DEBUG (optional)
  // console.log("Scanning:", filePath);

  if (!fs.existsSync(filePath)) return;

  let data;

  try{
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }catch(err){
    console.error("❌ JSON Error in:", filePath);
    return;
  }

  if (!Array.isArray(data)) return;

  data.forEach(item => {

    const newPath = currentPath
      ? `${currentPath},${item.id}`
      : item.id;

    /* ================= CATEGORY ================= */

    if (item.type === "category") {

      searchData.push({
        name: item.name,
        id: item.id,
        type: "category",
        universe: universe,
        path: currentPath,
        parent: parentName || formatName(universe),
        url: `category.html?universe=${universe}&path=${newPath}`
      });

      scan(universe, newPath, item.name);
    }

    /* ================= ENTITY ================= */

    if (item.type === "entity") {

      searchData.push({
        name: item.name,
        id: item.id,
        type: "entity",
        universe: universe,
        path: currentPath,
        parent: parentName || formatName(universe),
        url: currentPath
          ? `entity.html?universe=${universe}&path=${currentPath}&id=${item.id}`
          : `entity.html?universe=${universe}&id=${item.id}`
      });

    }

  });

}

/* ================= RUN ================= */

universes.forEach(u => {
  scan(u.id);
});

/* ================= SAVE ================= */

fs.writeFileSync(
  `${dataFolder}/search-data.json`,
  JSON.stringify(searchData, null, 2)
);

console.log("✅ Search data generated successfully");