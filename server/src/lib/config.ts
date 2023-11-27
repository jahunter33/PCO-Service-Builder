import dotenv from "dotenv";
const path = require("path");
const envPath = path.resolve(__dirname, "../../../.env");
dotenv.config({ path: envPath });

interface Config {
  APP_ID: string;
  SECRET: string;
  SERVICE_TYPE_ID: string;
  TEAM_ID: string;
}

const config = {
  APP_ID: process.env.APP_ID,
  SECRET: process.env.SECRET,
  SERVICE_TYPE_ID: process.env.SERVICE_TYPE_ID,
  TEAM_ID: process.env.TEAM_ID,
};

function isKeyOfConfig(key: string): key is keyof Config {
  return key in config;
}

for (let key in config) {
  if (isKeyOfConfig(key) && (config[key] === undefined || config[key] === "")) {
    throw new Error(`Missing ${key} in .env file`);
  }
}

export default config as Config;
