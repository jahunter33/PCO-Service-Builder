require("dotenv").config({ path: "../.env" });
const preferences = require("../../preferences.json");

const config = {
  APP_ID: process.env.APPLICATION_ID,
  SECRET: process.env.SECRET,
  SERVICE_TYPE_ID: process.env.SERVICE_TYPE_ID,
  TEAM_ID: process.env.TEAM_ID,
};

// validate variables
for (let key in config) {
  if (config[key] === undefined || config[key] === "") {
    throw new Error(`Missing ${key} in .env file`);
  }
}

module.exports = config;
