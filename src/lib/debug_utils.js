const fs = require("fs");

function writeJson(data, fileName) {
  fs.writeFile(`./data/${fileName}`, JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });
}

module.exports = { writeJson };
