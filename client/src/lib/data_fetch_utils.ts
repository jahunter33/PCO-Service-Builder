import { fetchLocalApi, ApiResponse, Body } from "./api_utils";

async function generateSchedule(date: string): Promise<ApiResponse> {
  const schedule = await fetchLocalApi(`/generate-schedule?date=${date}`);
  return schedule;
}

async function getSchedule(date: string): Promise<ApiResponse> {
  const schedule = await fetchLocalApi(`/get-schedule?date=${date}`);
  return schedule;
}

async function postSchedule(schedule: ApiResponse): Promise<void> {
  try {
    fetchLocalApi(`/post-schedule`, "POST", schedule.data);
  } catch (error) {
    console.error("An error occured: ", error);
  }
}

export { generateSchedule, getSchedule, postSchedule };
