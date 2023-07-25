import { fetchWebApi } from "./api_utils";
import config from "./config";
import { Schedule } from "./schedule_generator";
const SERVICE_TYPE_ID = config.SERVICE_TYPE_ID;
const TEAM_ID = config.TEAM_ID;

async function postSchedule(schedule: Schedule): Promise<void> {
  
  for (const teamPosition of schedule.team_positions) {
    for (const person of teamPosition.team_position_members) {
        const body = {
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
                            id: person.team_position_members,

 
    }
}
  
  
  
  
  
  
  
  
    console.log("Posting schedule...");



const res = await fetchWebApi(
  `services/v2/service_types/${SERVICE_TYPE_ID}/plans/${plans["current_plan"].id}/team_members`,
  "POST",
  body
);
  console.log("Schedule posted.");
}
