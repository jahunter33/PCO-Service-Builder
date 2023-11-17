import { fetchLocalApi, ApiResponse } from "./api_utils";

async function generateSchedule(date: string): Promise<ApiResponse> {
  const schedule = await fetchLocalApi(`/generate-schedule?date=${date}`);
  return schedule;
}

async function getSchedule(date: string): Promise<ApiResponse> {
  const schedule = await fetchLocalApi(`/get-schedule?date=${date}`);
  return schedule;
}

function getDateForCalendar(): Date {
  const today = new Date();
  return today;
}

export { generateSchedule, getSchedule };
