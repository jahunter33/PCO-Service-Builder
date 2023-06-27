require("dotenv").config();
const fs = require("fs");
const { get } = require("https");

const app_id = process.env.APPLICATION_ID;
const secret = process.env.SECRET;
let headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", "Basic " + btoa(app_id + ":" + secret));

let currentPlanAPI =
  "services/v2/service_types/305308/plans?filter=future&per_page=1";
let namesAPI = "services/v2/teams/1120542/people";
let teamPositionsAPI = "services/v2/teams/1120542/team_positions";
let positionAssignmentsAPI =
  "services/v2/teams/1120542/person_team_position_assignments";
let blockoutAPI = "services/v2/people/";

async function fetchWebApi(endpoint, method, body) {
  try {
    const response = await fetch(
      `https://api.planningcenteronline.com/${endpoint}`,
      {
        headers: headers,
        method: method,
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
}

// Needed when a list of data is not of a fixed length
async function fetchWithTotal(endpoint) {
  const meta = await fetchWebApi(endpoint, "GET");
  let totalCount = meta.meta.total_count;
  const data = await fetchWebApi(endpoint + `?per_page=${totalCount}`, "GET");
  return data;
}

async function getServices() {
  const service = await fetchWebApi(currentPlanAPI);
  currentPlan = service.data[0].id;
  previousSchedules["Current Plan"] = parseInt(currentPlan);
  for (let i = 1; i <= 4; i++) {
    previousSchedules[`${i} Week Ago`] = parseInt(currentPlan) - i;
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
}

async function getNames() {
  const names = await fetchWithTotal(namesAPI);
  for (let name of names.data) {
    personId = name.id;
    listOfNames[personId] = name.attributes.full_name;
  }
  fs.writeFile("names.json", JSON.stringify(listOfNames, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });
  return listOfNames;
}

async function getTeamPositions() {
  const positions = await fetchWebApi(teamPositionsAPI);
  for (let position of positions.data) {
    teamPositionId = position.id;
    teamPositions[teamPositionId] = position.attributes.name;
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
  const names = await getNames();
  const teamPositions = await getTeamPositions();

  const positionAssignments = await fetchWithTotal(positionAssignmentsAPI);
  for (let positionAssignment of positionAssignments.data) {
    let positionId = positionAssignment.relationships.team_position.data.id;
    let personId = positionAssignment.relationships.person.data.id;

    positionId = teamPositions[positionId];
    personId = names[personId];

    if (teamPositionAssignments[positionId]) {
      teamPositionAssignments[positionId].push(personId);
    } else {
      teamPositionAssignments[positionId] = [personId];
    }
  }
  fs.writeFile(
    "positions.json",
    JSON.stringify(teamPositionAssignments, null, 4),
    (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    }
  );
}

async function getBlockoutDates() {}

let listOfNames = {};
let teamPositions = {};
let teamPositionAssignments = {};
let previousSchedules = {};
let blockouts = {};
let currentPlan;

// Gets current service as well as previous 4 services
getServices();

getTeamPositionAssignments();
