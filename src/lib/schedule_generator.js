require("dotenv").config({ path: "../../.env" });
const {
  _getPeople,
  _getTeamPositionAssignments,
  _getPlans,
  _getConflicts,
  _getNeededPositions,
} = require("./data_fetch_utils");
const preferences = require("../../preferences.json");

async function generateSchedule() {
  const schedule = {};
  const people = await _getPeople();
  const previousPlans = await _getPlans();
  const teamPositionAssignments = await _getTeamPositionAssignments(people);
  const availablePeople = _removePeopleWithConflicts(
    people,
    previousPlans,
    teamPositionAssignments
  );
  const neededPositions = _getNeededPositions();
  if (neededPositions.length === 0) {
    return null;
  }
  for (let position in neededPositions) {
    let quanity = neededPositions[position]["quanity"];
    let people = availablePeople[position];
    let assignedPeople = [];
    if (people.length === 0) {
      console.log("No people available for position: ", position);
      continue;
    }
    for (let i = 0; i < quanity; i++) {
      let person = _getPersonWithHighestPriority(people, preferences);
      assignedPeople.push(person);
      availablePeople[position].splice(
        availablePeople[position].indexOf(person),
        1
      );
    }
    schedule[position] = assignedPeople;
  }
  console.log("Schedule: ", schedule);
  return schedule;
}

async function _removePeopleWithConflicts(
  people,
  plans,
  teamPositionAssignments
) {
  const availablePeople = {};
  const conflicts = await _getConflicts(people);

  for (let position in teamPositionAssignments) {
    // reverse for loop so that we dont skip over any indexes when we splice
    for (let i = teamPositionAssignments[position].length - 1; i >= 0; i--) {
      let person = teamPositionAssignments[position][i];

      if (conflicts[person]) {
        for (let conflict of conflicts[person]["potential_conflicts"]) {
          const planDate = new Date(plans["current_plan"]["date"]);
          const conflictDate = new Date(conflict);

          if (planDate.getTime() === conflictDate.getTime()) {
            availablePeople[position].splice(i, 1);
          }
        }

        for (let blockout of conflicts[person]["blockout_dates"]) {
          const planDate = new Date(plans["current_plan"]["date"]);
          const blockoutStart = new Date(blockout["starts_at"]);
          const blockoutEnd = new Date(blockout["ends_at"]);

          if (
            planDate.getTime() >= blockoutStart.getTime() &&
            planDate.getTime() <= blockoutEnd
          ) {
            availablePeople[position].splice(i, 1);
          }
        }
      }
    }
  }
  return availablePeople;
}

function _getPersonWithHighestPriority(people, preferences) {
  let highestPriority = 1;
  let highestPriorityPeople = [];

  for (let person of people) {
    let priority = preferences[person]["priority"];

    //FIXME: this is a hack to get around the priority logic
    if (priority > highestPriority) {
      highestPriority = priority;
      highestPriorityPeople = [person];
    } else if (priority === highestPriority) {
      highestPriorityPeople.push(person);
    }
  }

  let randomIndex = Math.floor(Math.random() * highestPriorityPeople.length);
  let person = highestPriorityPeople[randomIndex];

  return person;
}

module.exports = { generateSchedule };
