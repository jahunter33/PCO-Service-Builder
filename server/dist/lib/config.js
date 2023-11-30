"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path = require("path");
const envPath = path.resolve(__dirname, "../../../.env");
dotenv_1.default.config({ path: envPath });
const config = {
    APP_ID: process.env.APP_ID,
    SECRET: process.env.SECRET,
    SERVICE_TYPE_ID: process.env.SERVICE_TYPE_ID,
    TEAM_ID: process.env.TEAM_ID,
};
function isKeyOfConfig(key) {
    return key in config;
}
for (let key in config) {
    if (isKeyOfConfig(key) && (config[key] === undefined || config[key] === "")) {
        throw new Error(`Missing ${key} in .env file. Ensure that the .env file is located at ${envPath}.`);
    }
}
exports.default = config;
