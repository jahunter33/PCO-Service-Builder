const services = require("./service_data_fetch");

async function main() {
  const conflicts = require("./conflicts.json");
  const teamPositionAssignments = require("./team_position_assignments.json");
  const previousPlans = require("./previous_plans.json");

  services.removePeopleWithConflicts(
    conflicts,
    teamPositionAssignments,
    previousPlans
  );
}

main().catch((error) => {
  console.error(error);
});
