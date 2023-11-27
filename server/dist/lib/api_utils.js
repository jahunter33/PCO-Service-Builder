"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWebApi = void 0;
const config_1 = __importDefault(require("./config"));
const cross_fetch_1 = require("cross-fetch");
function fetchWebApi(endpoint, method, body, limit = 100, queryParams = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = new cross_fetch_1.Headers();
        header.append("Content-Type", "application/json");
        header.append("Authorization", "Basic " + btoa(config_1.default.APP_ID + ":" + config_1.default.SECRET));
        let results = [];
        let fetchedSoFar = 0;
        let offset = 0;
        let total = 0;
        do {
            const apiUrl = new URL(`https://api.planningcenteronline.com/${endpoint}`);
            queryParams.per_page = limit;
            queryParams.offset = offset;
            for (const key in queryParams) {
                apiUrl.searchParams.append(key, queryParams[key].toString());
            }
            try {
                const response = yield fetch(apiUrl.toString(), {
                    headers: header,
                    method: method,
                    body: body ? JSON.stringify(body) : undefined,
                });
                if (method === "POST") {
                    return {
                        data: response,
                    };
                }
                const data = yield response.json();
                if (data && data.data && data.meta) {
                    fetchedSoFar += data.data.length;
                    total = data.meta.total_count;
                    results = results.concat(data.data);
                }
                else {
                    throw new Error(`Error: Received unexpected response. Make sure the URL is correct. Response data: ${JSON.stringify(data)}`);
                }
                if (data.data.length === 0 || fetchedSoFar >= total) {
                    break;
                }
                offset += limit;
            }
            catch (error) {
                const newError = new Error(`Response unsuccessful: ${error.message}`);
                newError.stack = `${newError.stack}\n\nOriginal stack trace:\n${error.stack}`;
                throw newError;
            }
        } while (true);
        return {
            data: results,
        };
    });
}
exports.fetchWebApi = fetchWebApi;
