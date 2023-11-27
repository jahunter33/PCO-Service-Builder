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
Object.defineProperty(exports, "__esModule", { value: true });
const debug_utils_1 = require("./debug_utils");
const data_fetch_utils_1 = require("./data_fetch_utils");
function createPreferences(people) {
    const preferences = [];
    for (const person of people) {
        const preference = {
            person_id: person.person_id,
            person_name: person.person_name,
            priority: 0,
        };
        preferences.push(preference);
    }
    (0, debug_utils_1.writeJson)(preferences, "preferences.json");
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const people = yield (0, data_fetch_utils_1.getPeople)();
        createPreferences(people);
    });
}
main();
