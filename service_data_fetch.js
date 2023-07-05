require("dotenv").config();
const fs = require("fs");
const { fetchWebApi } = require("./api_utils");

const SERVICE_TYPE_ID = process.env.SERVICE_TYPE_ID;
const TEAM_ID = process.env.TEAM_ID;

async function getServices() {
  const previousSchedules = {};
  const currentServicesRes = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans`,
    "GET",
    undefined,
    1,
    { filter: "future" }
  );

  let planId = currentServicesRes.data[0].id;
  let planDate = currentServicesRes.data[0].attributes.sort_date;

  previousSchedules["Current Plan"] = {
    id: parseInt(planId),
    date: planDate,
  };

  const pastServicesRes = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans`,
    "GET",
    undefined,
    4,
    { filter: "past", order: "-sort_date" }
  );

  for (let i = 0; i < pastServicesRes.data.length; i++) {
    planId = pastServicesRes.data[i].id;
    planDate = pastServicesRes.data[i].attributes.sort_date;

    // just for readability in json file
    previousSchedules[`${i}_week_ago`] = {
      id: parseInt(planId),
      date: planDate,
    };
  }

  fs.writeFile(
    "previous_plans.json",
    JSON.stringify(previousSchedules, null, 4),
    (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    }
  );
  return previousSchedules;
}

async function getPeople() {
  const peopleObject = {};
  const res = await fetchWebApi(`services/v2/teams/${TEAM_ID}/people`, "GET");
  for (let person of res.data) {
    personId = person.id;
    peopleObject[personId] = person.attributes.full_name;
  }
  fs.writeFile("people.json", JSON.stringify(peopleObject, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });
  return peopleObject;
}

async function getTeamPositions() {
  const teamPositions = {};
  const res = await fetchWebApi(
    `services/v2/teams/${TEAM_ID}/team_positions`,
    "GET"
  );
  for (let teamPosition of res.data) {
    teamPositionId = teamPosition.id;
    teamPositions[teamPositionId] = teamPosition.attributes.name;
  }
  fs.writeFile(
    "team_positions.json",
    JSON.stringify(teamPositions, null, 4),
    (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    }
  );
  return teamPositions;
}

async function getTeamPositionAssignments() {
  const teamPositionAssignments = {};
  const people = await getPeople();
  const teamPositions = await getTeamPositions();

  const res = await fetchWebApi(
    `services/v2/teams/${TEAM_ID}/person_team_position_assignments`,
    "GET"
  );
  for (let teamPositionAssignment of res.data) {
    const positionId =
      teamPositionAssignment.relationships.team_position.data.id;
    const personId = teamPositionAssignment.relationships.person.data.id;

    const positionName = teamPositions[positionId];
    const personName = people[personId];

    if (teamPositionAssignments[positionName]) {
      teamPositionAssignments[positionName].push(personName);
    } else {
      teamPositionAssignments[positionName] = [personName];
    }
  }
  fs.writeFile(
    "team_position_assignments.json",
    JSON.stringify(teamPositionAssignments, null, 4),
    (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    }
  );
  return teamPositionAssignments;
}

async function getConflicts() {
  const scheduleConflicts = {};
  const people = await getPeople();

  for (let personId in people) {
    let blockoutsRes = await fetchWebApi(
      `services/v2/people/${personId}/blockouts`,
      "GET",
      undefined,
      1000,
      { filter: "future" }
    );

    let conflictsRes = await fetchWebApi(
      `services/v2/people/${personId}/schedules`,
      "GET",
      undefined,
      1000
    );

    const blockoutIntervals = [];
    const potentialConflicts = [];

    for (i = 0; i < blockoutsRes.data.length; i++) {
      let startsAt = blockoutsRes.data[i].attributes.starts_at;
      let endsAt = blockoutsRes.data[i].attributes.ends_at;
      blockoutIntervals[i] = { starts_at: startsAt, ends_at: endsAt };
    }

    for (i = 0; i < conflictsRes.data.length; i++) {
      potentialConflicts.push(conflictsRes.data[i].attributes.sort_date);
    }

    if (blockoutIntervals.length > 0 || potentialConflicts.length > 0) {
      scheduleConflicts[people[personId]] = {
        id: personId,
        blockout_dates: blockoutIntervals,
        potential_conflicts: potentialConflicts,
      };
    }
  }

  fs.writeFile(
    "conflicts.json",
    JSON.stringify(scheduleConflicts, null, 4),
    (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    }
  );
  return scheduleConflicts;
}

async function getNeededPositions() {
  const neededPositions = {};
  const services = await getServices();
  const SERVICE_ID = services["Current Plan"].id;
  const res = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans/${SERVICE_ID}/needed_positions`,
    "GET",
    undefined,
    1000,
    { "where[team_id]": TEAM_ID }
  );
  for (let neededPosition of res.data) {
    neededPositions[neededPosition.attributes.team_position_name] = {
      quanity: neededPosition.attributes.quantity,
    };
  }
  if (
    Object.keys(neededPositions).length === 0 &&
    neededPositions.constructor === Object
  ) {
    console.log("All positions are filled!");
  } else {
    console.log("Positions still needed: ", neededPositions);
  }
  return neededPositions;
}

const services = {
  createPreferences: function (people) {
    const preferences = {};
    for (let person in people) {
      preferences[people[person]] = {
        id: person,
        priority: 0,
      };
    }

    let data = JSON.stringify(preferences, null, 4);
    fs.writeFile("preferences.json", data, (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    });
  },

  removePeopleWithConflicts: function (
    conflicts,
    teamPositionAssignments,
    previousPlans
  ) {
    for (let position in teamPositionAssignments) {
      // reverse for loop so that we dont skip over any indexes when we splice
      for (let i = teamPositionAssignments[position].length - 1; i >= 0; i--) {
        let person = teamPositionAssignments[position][i];

        if (conflicts[person]) {
          for (let conflict of conflicts[person]["potential_conflicts"]) {
            const planDate = new Date(previousPlans["Current Plan"]["date"]);
            const conflictDate = new Date(conflict);

            if (planDate.getTime() === conflictDate.getTime()) {
              teamPositionAssignments[position].splice(i, 1);
            }
          }

          for (let blockout of conflicts[person]["blockout_dates"]) {
            const planDate = new Date(previousPlans["Current Plan"]["date"]);
            const blockoutStart = new Date(blockout["starts_at"]);
            const blockoutEnd = new Date(blockout["ends_at"]);

            if (
              planDate.getTime() >= blockoutStart.getTime() &&
              planDate.getTime() <= blockoutEnd
            ) {
              teamPositionAssignments[position].splice(i, 1);
            }
          }
        }
      }
    }

    fs.writeFile(
      "team_position_assignments_UPDATED.json",
      JSON.stringify(teamPositionAssignments, null, 4),
      (err) => {
        if (err) {
          console.error("Error writing to file: ", err);
        } else {
          console.log("Data written to file successfully.");
        }
      }
    );
  },
};

module.exports = services;

getNeededPositions();
