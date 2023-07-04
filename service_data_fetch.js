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
    previousSchedules[`${i} Week Ago`] = {
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

async function getBlockoutDates() {
  const blockoutDates = {};
  const people = await getPeople();

  for (let personId in people) {
    let res = await fetchWebApi(
      `services/v2/people/${personId}/blockouts`,
      "GET",
      undefined,
      1000,
      { filter: "future" }
    );

    const blockoutIntervals = [];

    for (i = 0; i < res.data.length; i++) {
      let startsAt = res.data[i].attributes.starts_at;
      let endsAt = res.data[i].attributes.ends_at;
      blockoutIntervals[i] = { "Starts at": startsAt, "Ends at": endsAt };
    }

    if (blockoutIntervals.length > 0) {
      blockoutDates[people[personId]] = {
        id: personId,
        blockoutsDates: blockoutIntervals,
      };
    }
  }

  fs.writeFile(
    "blockouts.json",
    JSON.stringify(blockoutDates, null, 4),
    (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    }
  );
  return blockoutDates;
}

getServices();

getTeamPositionAssignments();

getBlockoutDates();
