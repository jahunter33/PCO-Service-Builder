require("dotenv").config({ path: "../../.env" });
const fs = require("fs");

function createPreferences(people) {
  const preferences = {};
  for (let person in people) {
    preferences[people[person]] = {
      id: person,
      priority: 0,
    };
  }

  let data = JSON.stringify(preferences, null, 4);
  fs.writeFile("preferences.json", data, (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });
}
