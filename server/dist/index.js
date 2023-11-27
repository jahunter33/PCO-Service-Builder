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
const schedule_generator_1 = require("./lib/schedule_generator");
const schedule_poster_1 = require("./lib/schedule_poster");
const console_utils_1 = require("./lib/console_utils");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const date = yield askQuestion("Please enter the date you would like, or press enter (YYYY-MM-DD format): ");
        let schedule;
        if (date === "") {
            schedule = yield (0, schedule_generator_1.generateSchedule)();
        }
        else {
            schedule = yield (0, schedule_generator_1.generateSchedule)(date);
        }
        let arePeopleScheduled = false;
        if (schedule !== undefined) {
            for (const teamPosition of schedule.team_positions) {
                if (teamPosition.team_position_members.length > 0) {
                    arePeopleScheduled = true;
                    break;
                }
            }
        }
        else {
            console.log("No schedule to post.");
            rl.close();
            return;
        }
        // Print the schedule to the console
        console.log(schedule);
        (0, console_utils_1.printScheduleToConsole)(schedule);
        if (arePeopleScheduled) {
            const answer = yield askQuestion("Would you like to post this schedule? (y/n): ");
            if (answer === "y") {
                yield (0, schedule_poster_1.postSchedule)(schedule);
                rl.close();
            }
            else {
                console.log("Schedule not posted.");
                rl.close();
            }
        }
        else {
            (0, console_utils_1.printScheduleError)();
            console.log("No schedule to post.");
            rl.close();
        }
    });
}
main();
