const { generateSchedule } = require("./lib/schedule_generator");
const { postSchedule } = require("./lib/schedule_poster");

require("dotenv").config({ path: "../.env" });

console.log("Running main.js");
function main() {
  generateSchedule();
  //postSchedule(scheduleAssignments);
}

main();

// main().catch((error) => {
//   console.error(error);
// });
