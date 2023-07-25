import { ApiResponse, fetchWebApi } from "./api_utils";
import config from "./config";
const SERVICE_TYPE_ID: string | undefined = config.SERVICE_TYPE_ID;
const TEAM_ID: string | undefined = config.TEAM_ID;

// interfaces for return values
interface Person {
  person_id: string;
  person_name: string;
}
interface TeamPosition {
  team_position_id: string;
  team_position_name: string;
}
interface PositionAssignment {
  team_position_name: string;
  team_position_members: string[];
}
interface Plan {
  plan_id: string;
  plan_date: string;
}
interface Conflict {
  person_id: string;
  person_name: string;
  conflicts: BlockoutInterval[];
}
interface NeededPositions {
  needed_position: string;
  quantity_needed: number;
}
interface BlockoutInterval {
  startsAt: Date;
  endsAt: Date;
}
// function to get all people on a team
async function getPeople(): Promise<Person[]> {
  const people: Person[] = [];
  console.log("Getting people...");
  const response: ApiResponse = await fetchWebApi(
    `services/v2/teams/${TEAM_ID}/people`,
    "GET"
  );
  for (const person of response.data) {
    const peopleObj: Person = {
      person_id: person.id,
      person_name: person.attributes.full_name,
    };
    people.push(peopleObj);
  }
  console.log("People retrieved.");
  return people;
}

// function to get all positions on a team
async function getTeamPositions(): Promise<TeamPosition[]> {
  const teamPositions: TeamPosition[] = [];
  console.log("Getting team positions...");
  const response: ApiResponse = await fetchWebApi(
    `services/v2/teams/${TEAM_ID}/team_positions`,
    "GET"
  );
  for (const teamPosition of response.data) {
    const teamPositionObj: TeamPosition = {
      team_position_id: teamPosition.id,
      team_position_name: teamPosition.attributes.name,
    };
    teamPositions.push(teamPositionObj);
  }
  console.log("Team positions retrieved.");
  return teamPositions;
}

// function to relate people to positions
async function getTeamPositionAssignments(
  people: Person[],
  teamPositions: TeamPosition[]
): Promise<PositionAssignment[]> {
  const teamPositionAssignments: PositionAssignment[] = [];
  console.log("Getting team position assignments...");
  const response: ApiResponse = await fetchWebApi(
    `services/v2/teams/${TEAM_ID}/person_team_position_assignments`,
    "GET"
  );
  for (const teamPosition of teamPositions) {
    const teamPositionAssignment: PositionAssignment = {
      team_position_name: teamPosition.team_position_name,
      team_position_members: [],
    };
    for (const assignment of response.data) {
      if (
        assignment.relationships.team_position.data.id ===
        teamPosition.team_position_id
      ) {
        for (const person of people) {
          if (assignment.relationships.person.data.id === person.person_id) {
            teamPositionAssignment.team_position_members.push(
              person.person_name
            );
          }
        }
      }
    }
    teamPositionAssignments.push(teamPositionAssignment);
  }
  return teamPositionAssignments;
}

// function gets plan for date in argument, or next Sunday if no argument
async function getPlan(date?: Date): Promise<Plan[]> {
  const plans: Plan[] = [];
  const targetDate: Date = date ? date : getNextSunday();
  console.log("Getting plan...");
  const response: ApiResponse = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans`,
    "GET",
    undefined,
    100,
    { filter: "future" }
  );
  for (const plan of response.data) {
    const planDate = new Date(plan.attributes.sort_date);
    if (planDate.toISOString() === targetDate.toISOString()) {
      const planObj: Plan = {
        plan_id: plan.id,
        plan_date: plan.attributes.sort_date,
      };
      plans.push(planObj);
      break;
    }
  }
  console.log("Plan retrieved.");
  return plans;
}

// function gets conflicts for each person
async function getConflicts(
  people: Person[],
  plan: Plan[]
): Promise<Conflict[]> {
  const scheduleConflicts: Conflict[] = [];
  const dayInMilliseconds: number = 86400000;
  const statusResponse: ApiResponse = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans/${plan[0].plan_id}/team_members`,
    "GET"
  );
  for (const person of people) {
    const blockoutResponse: ApiResponse = await fetchWebApi(
      `services/v2/people/${person.person_id}/blockouts`,
      "GET",
      undefined,
      100,
      { filter: "future" }
    );
    // anyone who is declined "D", confirmed "C", or unconfirmed "U" is considered unavailable for scheduling
    const conflicts: BlockoutInterval[] = [];
    for (const status of statusResponse.data) {
      if (status.attributes.name === person.person_name) {
        if (
          status.attributes.status === "D" ||
          status.attributes.status === "C" ||
          status.attributes.status === "U"
        ) {
          const startsAt: Date = new Date(plan[0].plan_date);
          const endsAt: Date = new Date(startsAt.getTime() + dayInMilliseconds);
          const declinedTime: BlockoutInterval = {
            startsAt: startsAt,
            endsAt: endsAt,
          };
          conflicts.push(declinedTime);
        }
      }
    }
    // adds *relevant* blockouts to conflicts, does not add blockouts from weeks in the future
    for (const blockout of blockoutResponse.data) {
      // checks to see if the plan date is within the blockout
      if (
        plan[0].plan_date >= blockout.attributes.starts_at &&
        plan[0].plan_date <= blockout.attributes.ends_at
      ) {
        const startsAt: Date = new Date(blockout.attributes.starts_at);
        const endsAt: Date = new Date(blockout.attributes.ends_at);
        const blockoutInterval: BlockoutInterval = {
          startsAt: startsAt,
          endsAt: endsAt,
        };
        conflicts.push(blockoutInterval);
      }
    }
    const conflictObj: Conflict = {
      person_id: person.person_id,
      person_name: person.person_name,
      conflicts: conflicts,
    };
    scheduleConflicts.push(conflictObj);
  }
  return scheduleConflicts;
}

async function getNeededPositions(plan: Plan[]): Promise<NeededPositions[]> {
  const neededPositions: NeededPositions[] = [];
  const serviceId: string = plan[0].plan_id;
  const teamIdString: string = TEAM_ID ? TEAM_ID : "";
  console.log("Getting needed positions...");
  const response: ApiResponse = await fetchWebApi(
    `services/v2/service_types/${SERVICE_TYPE_ID}/plans/${serviceId}/needed_positions`,
    "GET",
    undefined,
    1000,
    { "where[team_id]": teamIdString }
  );
  for (const position of response.data) {
    const neededPosition: NeededPositions = {
      needed_position: position.attributes.team_position_name,
      quantity_needed: position.attributes.quantity,
    };
    neededPositions.push(neededPosition);
  }
  if (Object.keys(neededPositions).length === 0) {
    console.log("All positions are filled!");
  } else {
    console.log("Positions still needed: ", neededPositions);
  }
  return neededPositions;
}

// function specifically gets the next Sunday
function getNextSunday(date: string | Date = new Date()): Date {
  const newDate: Date = new Date(date);
  const day: number = newDate.getUTCDay();
  const diff = day === 0 ? 0 : 7 - day; // if current day is Sunday, diff will be 0
  const nextSunday: Date = new Date(newDate);
  nextSunday.setUTCDate(newDate.getUTCDate() + diff);
  nextSunday.setUTCHours(9);
  nextSunday.setUTCMinutes(15);
  nextSunday.setUTCSeconds(0);
  nextSunday.setUTCMilliseconds(0);
  return nextSunday;
}

export {
  Person,
  TeamPosition,
  PositionAssignment,
  Plan,
  Conflict,
  NeededPositions,
  getPeople,
  getTeamPositions,
  getTeamPositionAssignments,
  getPlan,
  getConflicts,
  getNeededPositions,
  getNextSunday,
};
