"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJson = void 0;
const fs = __importStar(require("fs"));
function writeJson(data, fileName) {
    // this is not the correct directory location to which the file should be written
    fs.mkdir("./server/data", { recursive: true }, (err) => {
        if (err) {
            console.error("Error creating directory: ", err);
        }
        else {
            fs.writeFile(`./server/data/${fileName}`, JSON.stringify(data, null, 4), (err) => {
                if (err) {
                    console.error("Error writing to file: ", err);
                }
                else {
                    console.log(`JSON saved to ${fileName}`);
                }
            });
        }
    });
}
exports.writeJson = writeJson;
