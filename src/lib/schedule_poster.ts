import { Body, fetchWebApi } from "./api_utils";
import config from "./config";
import { Schedule } from "./schedule_generator";

async function postSchedule(schedule: Schedule | void): Promise<void> {
  if (schedule === undefined) {
    console.log("No schedule to post.");
    return;
  }
  console.log("Posting schedule...");
  for (const teamPosition of schedule.team_positions) {
    for (const person of teamPosition.team_position_members) {
      const body: Body = {
        data: {
          type: "PlanPerson",
          attributes: {
            status: "U",
            notes: "Scheduled by API",
            team_position_name: teamPosition.team_position_name,
            prepare_notification: true,
          },
          relationships: {
            person: {
              data: {
                type: "Person",
                id: person.person_id,
              },
            },
            team: {
              data: {
                type: "Team",
                id: config.TEAM_ID,
              },
            },
          },
        },
      };
      const res = await fetchWebApi(
        `services/v2/service_types/${config.SERVICE_TYPE_ID}/plans/${schedule.plan_id}/team_members`,
        "POST",
        body
      );
    }
  }
  console.log("Schedule posted.");
}

export { postSchedule };
