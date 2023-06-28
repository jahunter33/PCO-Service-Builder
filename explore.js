require("dotenv").config();
const fs = require("fs");
const { get } = require("https");
const { stringify } = require("querystring");

const app_id = process.env.APPLICATION_ID;
const secret = process.env.SECRET;
let headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", "Basic " + btoa(app_id + ":" + secret));

const currentPlanAPI = process.env.CURRENT_PLAN;
const namesAPI = process.env.LIST_OF_NAMES;
const teamPositionsAPI = process.env.TEAM_POSITIONS;
const positionAssignmentsAPI = process.env.TEAM_POSITION_ASSIGNMENTS;
const blockoutAPI = process.env.BLOCKOUT_DATES;

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

async function fetchOffset(endpoint) {
  const meta = await fetchWebApi(endpoint, "GET");
  let offset = meta.meta.total_count;
  return offset;
}

async function getServices() {
  const futureFilter = "?filter=future&per_page=1";
  const pastFilter = "?filter=past&per_page=4&offset=523";
  const currentService = await fetchWebApi(
    currentPlanAPI + futureFilter,
    "GET"
  );

  let planId = currentService.data[0].id;
  let planDate = currentService.data[0].attributes.sort_date;

  previousSchedules["Current Plan"] = {
    id: parseInt(planId),
    date: planDate,
  };

  let offset = await fetchOffset(currentPlanAPI + pastFilter);
  offset = stringify(offset - 4);
  const pastServices = await fetchWebApi(
    currentPlanAPI + pastFilter + offset,
    "GET"
  );
  for (let i = 3; i >= 0; i--) {
    const j = 4 - i;
    planId = pastServices.data[i].id;
    planDate = pastServices.data[i].attributes.sort_date;

    previousSchedules[`${j > 1 ? j + " Weeks Ago" : "1 Week Ago"}`] = {
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
  const positions = await fetchWebApi(teamPositionsAPI, "GET");
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
}

async function getBlockoutDates() {
  const teamMemberIds = await getNames();
  const teamIds = [];

  Object.keys(teamMemberIds).forEach((key) => {
    teamIds.push(key);
  });

  for (let memberId of teamIds) {
    let currentBlockoutApiUrl = blockoutAPI.replace("1", memberId);
    let blackoutResponse = await fetchWebApi(currentBlockoutApiUrl, "GET");
    const totalBlockoutCount = parseInt(blackoutResponse.meta.total_count);

    const blockoutIntervals = [];
    if (totalBlockoutCount >> 0) {
      for (i = 0; i < totalBlockoutCount; i++) {
        let startsAt = blackoutResponse.data[i].attributes.starts_at;
        let endsAt = blackoutResponse.data[i].attributes.ends_at;
        blockoutIntervals[i] = { "Starts at": startsAt, "Ends at": endsAt };
      }

      blockouts[teamMemberIds[memberId]] = {
        id: memberId,
        number_of_blockouts: totalBlockoutCount,
        blockouts: blockoutIntervals,
      };
    }
  }

  fs.writeFile("blockouts.json", JSON.stringify(blockouts, null, 4), (err) => {
    if (err) {
      console.error("Error writing to file: ", err);
    } else {
      console.log("Data written to file successfully.");
    }
  });
  return blockouts;
}

let listOfNames = {};
let teamPositions = {};
let teamPositionAssignments = {};
let previousSchedules = {};
let blockouts = {};

getServices();

getTeamPositionAssignments();

getBlockoutDates();
