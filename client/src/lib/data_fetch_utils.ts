import { fetchLocalApi, ApiResponse, Body } from "./api_utils";

interface Person {
  person_id: string;
  person_name: string;
}

interface PositionAssignment {
  team_position_name: string;
  team_position_members: Person[];
}

interface Schedule {
  plan_id: string;
  plan_date: string;
  team_positions: PositionAssignment[];
}

async function generateSchedule(date: string): Promise<ApiResponse> {
  const schedule = await fetchLocalApi(`/generate-schedule?date=${date}`);
  return schedule;
}

async function getSchedule(date: string): Promise<ApiResponse> {
  const schedule = await fetchLocalApi(`/get-schedule?date=${date}`);
  return schedule;
}

async function postSchedule(schedule: Schedule): Promise<void> {}

function getDateForCalendar(): Date {
  const today = new Date();
  return today;
}

export { generateSchedule, getSchedule };
