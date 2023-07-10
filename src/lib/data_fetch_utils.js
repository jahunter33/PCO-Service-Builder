require("dotenv").config({ path: "../../.env" });
const { fetchWebApi } = require("./api_utils");
const SERVICE_TYPE_ID = process.env.SERVICE_TYPE_ID;
const TEAM_ID = process.env.TEAM_ID;

async function _getPeople() {
  const peopleObject = {};
  const res = await fetchWebApi(`services/v2/teams/${TEAM_ID}/people`, "GET");
  for (let person of res.data) {
    personId = person.id;
    peopleObject[personId] = person.attributes.full_name;
  }
  return peopleObject;
}

async function _getTeamPositions() {
  const teamPositions = {};
  const res = await fetchWebApi(
    `services/v2/teams/${TEAM_ID}/team_positions`,
    "GET"
  );
  for (let teamPosition of res.data) {
    teamPositionId = teamPosition.id;
    teamPositions[teamPositionId] = teamPosition.attributes.name;
  }
  return teamPositions;
}

async function _getTeamPositionAssignments(people) {
  const teamPositionAssignments = {};
  const teamPositions = await _getTeamPositions();
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
  return teamPositionAssignments;
}

async function _getPlans() {
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
  previousSchedules["current_plan"] = {
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
    previousSchedules[i] = {
      id: parseInt(planId),
      date: planDate,
    };
  }
  return previousSchedules;
}

// FIXME: If someone has already declined for that week, include them in the list of people with conflicts
async function _getConflicts(people) {
  const scheduleConflicts = {};
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
  return scheduleConflicts;
}

async function _getNeededPositions() {
  const neededPositions = {};
  const plans = await _getPlans();
  const serviceId = plans["current_plan"].id;
  const res = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans/${serviceId}/needed_positions`,
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

module.exports = {
  _getPeople,
  _getTeamPositionAssignments,
  _getPlans,
  _getConflicts,
  _getNeededPositions,
};
