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
exports.generateSchedule = void 0;
const data_fetch_utils_1 = require("./data_fetch_utils");
// main component of schedule generator
function generateSchedule(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const scheduleTeamPositions = [];
        const plan = yield (0, data_fetch_utils_1.getPlan)((0, data_fetch_utils_1.getNextSunday)(date));
        console.log("Generating schedule...");
        const people = yield (0, data_fetch_utils_1.getPeople)();
        const teamPositions = yield (0, data_fetch_utils_1.getTeamPositions)();
        const teamPositionAssignments = yield (0, data_fetch_utils_1.getTeamPositionAssignments)(people, teamPositions);
        const conflicts = yield (0, data_fetch_utils_1.getConflicts)(people, plan);
        let availablePeople = yield _removePeopleWithConflicts(teamPositionAssignments, conflicts);
        const neededPositions = yield (0, data_fetch_utils_1.getNeededPositions)(plan);
        if (neededPositions.length === 0) {
            console.log("No positions needed.");
            return;
        }
        for (const position of neededPositions) {
            const positionIndex = availablePeople.findIndex((element) => element.team_position_name === position.needed_position);
            const positionAssignment = availablePeople[positionIndex];
            const peopleWithHighestPriority = _getPeopleWithHighestPriority(positionAssignment);
            const scheduledPeople = _randomizePeople(peopleWithHighestPriority, position.quantity_needed);
            if (scheduledPeople[0] !== undefined) {
                availablePeople = _removeDuplicates(availablePeople, scheduledPeople);
                const scheduledPosition = {
                    team_position_name: positionAssignment.team_position_name,
                    team_position_members: scheduledPeople,
                };
                scheduleTeamPositions.push(scheduledPosition);
            }
            else {
                const scheduledPosition = {
                    team_position_name: positionAssignment.team_position_name,
                    team_position_members: [],
                };
                scheduleTeamPositions.push(scheduledPosition);
            }
        }
        const schedule = {
            plan_id: plan[0].plan_id,
            plan_date: plan[0].plan_date,
            team_positions: scheduleTeamPositions,
        };
        return schedule;
    });
}
exports.generateSchedule = generateSchedule;
function _removePeopleWithConflicts(positionAssignments, conflicts) {
    return __awaiter(this, void 0, void 0, function* () {
        const availablePeople = [];
        for (const assignment of positionAssignments) {
            const teamPositionAssignment = {
                team_position_name: assignment.team_position_name,
                team_position_members: [],
            };
            for (const person of conflicts) {
                if (person.conflicts.length === 0 &&
                    assignment.team_position_members
                        .map((element) => element.person_name)
                        .includes(person.person_name)) {
                    const nonConflictingPerson = {
                        person_id: person.person_id,
                        person_name: person.person_name,
                    };
                    teamPositionAssignment.team_position_members.push(nonConflictingPerson);
                }
            }
            availablePeople.push(teamPositionAssignment);
        }
        return availablePeople;
    });
}
// function to get people with highest priority
// FIXME: this function can't handle a scenario where there are not enough people of highest priority to fill a position
function _getPeopleWithHighestPriority(people) {
    const preferences = require("../../data/preferences.json");
    let highestPriority = 1;
    const highestPriorityPeopleArray = [];
    for (const person of people.team_position_members) {
        const personIndex = preferences.findIndex((element) => element.person_name === person.person_name);
        const personPriority = preferences[personIndex].priority;
        if (personPriority > highestPriority) {
            highestPriority = personPriority;
            highestPriorityPeopleArray.length = 0;
            const highestPriorityPerson = {
                person_id: preferences[personIndex].person_id,
                person_name: preferences[personIndex].person_name,
            };
            highestPriorityPeopleArray.push(highestPriorityPerson);
        }
        else if (personPriority === highestPriority) {
            const highestPriorityPerson = {
                person_id: preferences[personIndex].person_id,
                person_name: preferences[personIndex].person_name,
            };
            highestPriorityPeopleArray.push(highestPriorityPerson);
        }
    }
    return highestPriorityPeopleArray;
}
// simple randomizer function
function _randomizePeople(people, quantity) {
    const randomizedPeople = [];
    for (let i = 0; i < quantity; i++) {
        const randomIndex = Math.floor(Math.random() * people.length);
        randomizedPeople.push(people[randomIndex]);
        people.splice(randomIndex, 1);
    }
    return randomizedPeople;
}
// function to remove people who have already been scheduled for a position from the list of available people
//FIXME: After changing the team_position_members property of the PositionAssignment interface to an array of Person objects, this function no longer works
function _removeDuplicates(availablePeople, scheduledPeople) {
    for (const scheduledPerson of scheduledPeople) {
        for (const positionAssignment of availablePeople) {
            const personIndex = positionAssignment.team_position_members.findIndex((availablePerson) => availablePerson.person_id === scheduledPerson.person_id);
            if (personIndex !== -1) {
                positionAssignment.team_position_members.splice(personIndex, 1);
            }
        }
    }
    return availablePeople;
}
