require("dotenv").config();
const fs = require("fs");
const { fetchWebApi } = require("./api_utils");

const SERVICE_TYPE_ID = process.env.SERVICE_TYPE_ID;
const TEAM_ID = process.env.TEAM_ID;

const services = {
  // async functions
  postSchedule: async function (scheduleAssignments, plans, preferences) {
    //let data = [];

    for (let position in scheduleAssignments) {
      for (let person of scheduleAssignments[position]) {
        let person_id = preferences[person].id;

        let body = {
          data: {
            type: "PlanPerson",
            attributes: {
              status: "U",
              notes: "scheduled by api",
              team_position_name: position,
              prepare_notification: true,
            },
            relationships: {
              person: {
                data: {
                  type: "Person",
                  id: person_id,
                },
              },
            },
          },
        };
        const res = await fetchWebApi(
          `services/v2/service_types/${SERVICE_TYPE_ID}/plans/${plans["current_plan"].id}/team_members`,
          "POST",
          body
        );
        console.log(res);
        //data.push(body);
      }
    }

    // console.log("Data: ", data);

    // let schedule = { data };

    // console.log("Schedule: ", schedule);
  },

  getPlans: async function () {
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
  },

  getPeople: async function () {
    const peopleObject = {};
    const res = await fetchWebApi(`services/v2/teams/${TEAM_ID}/people`, "GET");
    for (let person of res.data) {
      personId = person.id;
      peopleObject[personId] = person.attributes.full_name;
    }

    return peopleObject;
  },

  getTeamPositions: async function () {
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
  },

  getTeamPositionAssignments: async function () {
    const teamPositionAssignments = {};
    const people = await services.getPeople();
    const teamPositions = await services.getTeamPositions();

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
  },

  getConflicts: async function () {
    const scheduleConflicts = {};
    const people = await services.getPeople();

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
  },

  getNeededPositions: async function () {
    const neededPositions = {};
    const plans = await services.getPlans();
    const SERVICE_ID = plans["current_plan"].id;
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
  },

  // non async functions below
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
            const planDate = new Date(previousPlans["current_plan"]["date"]);
            const conflictDate = new Date(conflict);

            if (planDate.getTime() === conflictDate.getTime()) {
              teamPositionAssignments[position].splice(i, 1);
            }
          }

          for (let blockout of conflicts[person]["blockout_dates"]) {
            const planDate = new Date(previousPlans["current_plan"]["date"]);
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

    services.writeJson(
      teamPositionAssignments,
      "team_position_assignments_UPDATED.json"
    );

    return teamPositionAssignments;
  },

  getPersonWithHighestPriority: function (people, preferences) {
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
  },

  generateSchedule: function (neededPositions, availablePeople) {
    const preferences = require("./preferences.json");
    const schedule = {};

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
        let person = services.getPersonWithHighestPriority(people, preferences);
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
  },

  // function for debugging purposes
  writeJson: function (data, fileName) {
    fs.writeFile(fileName, JSON.stringify(data, null, 4), (err) => {
      if (err) {
        console.error("Error writing to file: ", err);
      } else {
        console.log("Data written to file successfully.");
      }
    });
  },
};

module.exports = services;

//getNeededPositions();
