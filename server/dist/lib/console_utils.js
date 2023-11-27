"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printScheduleError = exports.printScheduleToConsole = void 0;
//ANSI escape code for BOLD and colored text
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";
function printScheduleToConsole(schedule) {
    console.log(`\n${BOLD}%s${RESET}`, "\tSchedule for the week of: " + _formatDate(schedule.plan_date));
    console.log("\n");
    const maxLength = Math.max(...schedule.team_positions.map((pos) => pos.team_position_name.length));
    for (const teamPosition of schedule.team_positions) {
        const positionMemberArray = [];
        let positionMemberString = "";
        for (const person of teamPosition.team_position_members) {
            positionMemberArray.push(person.person_name);
            positionMemberString = positionMemberArray.join(", ");
        }
        if (positionMemberString === "") {
            console.log("\t", teamPosition.team_position_name.padEnd(maxLength), "\t", `${BOLD}${RED}No available players${RESET}`);
        }
        else {
            console.log("\t", teamPosition.team_position_name.padEnd(maxLength), "\t", `${GREEN}${BOLD}${positionMemberString}${RESET}`);
        }
    }
    console.log("\n");
}
exports.printScheduleToConsole = printScheduleToConsole;
function printScheduleError() {
    console.log(`\t${BOLD}${RED}%s${RESET}\n`, "No available players for any position. No schedule generated.");
}
exports.printScheduleError = printScheduleError;
function _getDaySuffix(date) {
    const dayOfMonth = date.getDate();
    if (dayOfMonth >= 11 && dayOfMonth <= 13) {
        return "th";
    }
    switch (dayOfMonth % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}
function _formatDate(dateStr) {
    const date = new Date(dateStr);
    const daySuffix = _getDaySuffix(date);
    const formattedDate = `${date.toLocaleString("en-US", {
        month: "long",
    })} ${date.getDate()}${daySuffix}, ${date.getFullYear()}`;
    return formattedDate;
}
