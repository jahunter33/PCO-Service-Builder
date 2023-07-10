const { generateSchedule } = require("./lib/schedule_generator");
const { postSchedule } = require("./lib/schedule_poster");

async function main() {
  const scheduleAssignments = await generateSchedule();
  //postSchedule(scheduleAssignments);
}

main().catch((error) => {
  console.error(error);
});
