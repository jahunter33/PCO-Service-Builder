import { generateSchedule } from "./lib/schedule_generator";
import { postSchedule } from "./lib/schedule_poster";

async function main(): Promise<void> {
  const schedule = await generateSchedule("2023-08-06");
  await postSchedule(schedule);
}

main();
