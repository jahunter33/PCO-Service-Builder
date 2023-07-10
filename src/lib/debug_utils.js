require("dotenv").config({ path: "../../.env" });
const fs = require("fs");

function _writeJson(data, fileName) {
  fs.writeFile(`./data/${fileName}`, JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });
}

module.exports = { _writeJson };
