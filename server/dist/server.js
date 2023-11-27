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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const schedule_generator_1 = require("./lib/schedule_generator");
const data_fetch_utils_1 = require("./lib/data_fetch_utils");
const schedule_poster_1 = require("./lib/schedule_poster");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get("/generate-schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.query.date;
    if (date) {
        const schedule = yield (0, schedule_generator_1.generateSchedule)(date);
        res.send(schedule);
        console.log("Schedule generated with given date");
    }
    else {
        console.log(`no date selected. using default value.`);
    }
}));
app.get("/get-schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.query.date;
    const plan = yield (0, data_fetch_utils_1.getPlan)((0, data_fetch_utils_1.getNextSunday)(date));
    if (date) {
        const schedule = yield (0, data_fetch_utils_1.getCurrentSchedule)(plan);
        res.send(schedule);
    }
}));
app.post("/post-schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = req.body;
    yield (0, schedule_poster_1.postSchedule)(schedule);
    res.status(200).json({ message: "Schedule posted successfully" });
}));
app.post("/goodbye", (req, res) => {
    res.send("Goodbye World!");
});
app.listen(3000, () => {
    console.log("Server is listening on port 3000!");
});
