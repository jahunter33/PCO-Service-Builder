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
exports.getSongs = exports.getCurrentSchedule = exports.getNextSunday = exports.getNeededPositions = exports.getConflicts = exports.getPlan = exports.getTeamPositionAssignments = exports.getTeamPositions = exports.getPeople = void 0;
const api_utils_1 = require("./api_utils");
const config_1 = __importDefault(require("./config"));
// function to get all people on a team
function getPeople() {
    return __awaiter(this, void 0, void 0, function* () {
        const people = [];
        console.log("Getting people...");
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/teams/${config_1.default.TEAM_ID}/people`, "GET");
        for (const person of response.data) {
            const peopleObj = {
                person_id: person.id,
                person_name: person.attributes.full_name,
            };
            people.push(peopleObj);
        }
        console.log("People retrieved.");
        return people;
    });
}
exports.getPeople = getPeople;
// function to get all positions on a team
function getTeamPositions() {
    return __awaiter(this, void 0, void 0, function* () {
        const teamPositions = [];
        console.log("Getting team positions...");
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/teams/${config_1.default.TEAM_ID}/team_positions`, "GET");
        for (const teamPosition of response.data) {
            const teamPositionObj = {
                team_position_id: teamPosition.id,
                team_position_name: teamPosition.attributes.name,
            };
            teamPositions.push(teamPositionObj);
        }
        console.log("Team positions retrieved.");
        return teamPositions;
    });
}
exports.getTeamPositions = getTeamPositions;
// function to relate people to positions
function getTeamPositionAssignments(people, teamPositions) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamPositionAssignments = [];
        console.log("Getting team position assignments...");
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/teams/${config_1.default.TEAM_ID}/person_team_position_assignments`, "GET");
        for (const teamPosition of teamPositions) {
            const teamPositionAssignment = {
                team_position_name: teamPosition.team_position_name,
                team_position_members: [],
            };
            for (const assignment of response.data) {
                if (assignment.relationships.team_position.data.id ===
                    teamPosition.team_position_id) {
                    for (const person of people) {
                        if (assignment.relationships.person.data.id === person.person_id) {
                            teamPositionAssignment.team_position_members.push(person);
                        }
                    }
                }
            }
            teamPositionAssignments.push(teamPositionAssignment);
        }
        return teamPositionAssignments;
    });
}
exports.getTeamPositionAssignments = getTeamPositionAssignments;
// function gets plan for date in argument, or next Sunday if no argument
function getPlan(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const plans = [];
        const targetDate = date ? date : getNextSunday();
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/service_types/${config_1.default.SERVICE_TYPE_ID}/plans`, "GET", undefined, 100, { filter: "future" });
        console.log("Getting plan...");
        for (const plan of response.data) {
            const planDate = new Date(plan.attributes.sort_date);
            if (planDate.toISOString() === targetDate.toISOString()) {
                const planObj = {
                    plan_id: plan.id,
                    plan_date: plan.attributes.sort_date,
                };
                plans.push(planObj);
                break;
            }
        }
        console.log("Plan retrieved.");
        return plans;
    });
}
exports.getPlan = getPlan;
// function gets conflicts for each person
function getConflicts(people, plan) {
    return __awaiter(this, void 0, void 0, function* () {
        const scheduleConflicts = [];
        const dayInMilliseconds = 86400000;
        const statusResponse = yield (0, api_utils_1.fetchWebApi)(`services/v2/service_types/${config_1.default.SERVICE_TYPE_ID}/plans/${plan[0].plan_id}/team_members`, "GET");
        for (const person of people) {
            const blockoutResponse = yield (0, api_utils_1.fetchWebApi)(`services/v2/people/${person.person_id}/blockouts`, "GET", undefined, 100, { filter: "future" });
            // anyone who is declined "D", confirmed "C", or unconfirmed "U" is considered unavailable for scheduling
            const conflicts = [];
            for (const status of statusResponse.data) {
                if (status.attributes.name === person.person_name) {
                    if (status.attributes.status === "D" ||
                        status.attributes.status === "C" ||
                        status.attributes.status === "U") {
                        const startsAt = new Date(plan[0].plan_date);
                        const endsAt = new Date(startsAt.getTime() + dayInMilliseconds);
                        const declinedTime = {
                            startsAt: startsAt,
                            endsAt: endsAt,
                        };
                        conflicts.push(declinedTime);
                    }
                }
            }
            // adds *relevant* blockouts to conflicts, does not add blockouts from weeks in the future
            for (const blockout of blockoutResponse.data) {
                // checks to see if the plan date is within the blockout
                if (plan[0].plan_date >= blockout.attributes.starts_at &&
                    plan[0].plan_date <= blockout.attributes.ends_at) {
                    const startsAt = new Date(blockout.attributes.starts_at);
                    const endsAt = new Date(blockout.attributes.ends_at);
                    const blockoutInterval = {
                        startsAt: startsAt,
                        endsAt: endsAt,
                    };
                    conflicts.push(blockoutInterval);
                }
            }
            const conflictObj = {
                person_id: person.person_id,
                person_name: person.person_name,
                conflicts: conflicts,
            };
            scheduleConflicts.push(conflictObj);
        }
        return scheduleConflicts;
    });
}
exports.getConflicts = getConflicts;
function getNeededPositions(plan) {
    return __awaiter(this, void 0, void 0, function* () {
        const neededPositions = [];
        const serviceId = plan[0].plan_id;
        // const teamIdString: string = config.TEAM_ID ? config.TEAM_ID : "";
        console.log("Getting needed positions...");
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/service_types/${config_1.default.SERVICE_TYPE_ID}/plans/${serviceId}/needed_positions`, "GET", undefined, 1000, { "where[team_id]": config_1.default.TEAM_ID });
        for (const position of response.data) {
            const neededPosition = {
                needed_position: position.attributes.team_position_name,
                quantity_needed: position.attributes.quantity,
            };
            neededPositions.push(neededPosition);
        }
        if (Object.keys(neededPositions).length === 0) {
            console.log("All positions are filled!");
        }
        return neededPositions;
    });
}
exports.getNeededPositions = getNeededPositions;
// function specifically gets the next Sunday
function getNextSunday(date = new Date()) {
    const newDate = new Date(date);
    const day = newDate.getUTCDay();
    const diff = day === 0 ? 0 : 7 - day; // if current day is Sunday, diff will be 0
    const nextSunday = new Date(newDate);
    nextSunday.setUTCDate(newDate.getUTCDate() + diff);
    nextSunday.setUTCHours(9);
    nextSunday.setUTCMinutes(15);
    nextSunday.setUTCSeconds(0);
    nextSunday.setUTCMilliseconds(0);
    return nextSunday;
}
exports.getNextSunday = getNextSunday;
function getCurrentSchedule(plan) {
    return __awaiter(this, void 0, void 0, function* () {
        const teamPositionAssignments = [];
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/service_types/${config_1.default.SERVICE_TYPE_ID}/plans/${plan[0].plan_id}/team_members`, "GET");
        if (response.data) {
            for (const teamMember of response.data) {
                if (teamMember.relationships.team.data.id === config_1.default.TEAM_ID) {
                    const people = [];
                    const person = {
                        person_id: "",
                        person_name: teamMember.attributes.name,
                    };
                    people.push(person);
                    const positionAssignment = {
                        team_position_name: teamMember.attributes.team_position_name,
                        team_position_members: people,
                    };
                    teamPositionAssignments.push(positionAssignment);
                }
            }
        }
        else {
            console.log("Response data is undefined.");
        }
        const currentSchedule = {
            plan_id: plan[0].plan_id,
            plan_date: plan[0].plan_date,
            team_positions: teamPositionAssignments,
        };
        return currentSchedule;
    });
}
exports.getCurrentSchedule = getCurrentSchedule;
// function to get list of songs
function getSongs(queryParams = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const songs = [];
        const response = yield (0, api_utils_1.fetchWebApi)(`services/v2/songs`, "GET", undefined, 1000, Object.assign({ hidden: "false" }, queryParams));
        for (const song of response.data) {
            const songObj = {
                song_id: song.id,
                song_title: song.attributes.title,
                song_author: song.attributes.author,
                ccli_number: song.attributes.ccli_number,
            };
            songs.push(songObj);
        }
        return songs;
    });
}
exports.getSongs = getSongs;
