const fs = require("fs");
const Path = require("path");
module.exports = (location) =>
  function getStringFromFile(path) {
    const data = fs.readFileSync(Path.resolve(location, path), {
      encoding: "utf8",
    });

    return data;
  };
