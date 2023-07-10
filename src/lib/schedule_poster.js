require("dotenv").config({ path: "../../.env" });
const { fetchWebApi } = require("./api_utils");
const { _getPlans } = require("./data_fetch_utils");
const preferences = require("../../preferences.json");
const SERVICE_TYPE_ID = process.env.SERVICE_TYPE_ID;
const TEAM_ID = process.env.TEAM_ID;

async function postSchedule(scheduleAssignments) {
  const plans = await _getPlans();
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
            team: {
              data: {
                type: "Team",
                id: TEAM_ID,
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
    }
  }
}

module.exports = {
  postSchedule,
};
