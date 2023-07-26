import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

interface Config {
  APP_ID: string | undefined;
  SECRET: string | undefined;
  SERVICE_TYPE_ID: string | undefined;
  TEAM_ID: string | undefined;
}

const config: Config = {
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

export default config;
