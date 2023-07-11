const { writeJson } = require("./debug_utils");

function createPreferences(people) {
  const preferences = {};
  for (let person in people) {
    preferences[people[person]] = {
      id: person,
      priority: 0,
    };
  }

  let data = JSON.stringify(preferences, null, 4);
  writeJson(data, "preferences.json");
}
