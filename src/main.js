const services = require("./src/service_data_fetch");
const preferences = require("./preferences.json");

async function main() {
  const conflicts = await services.getConflicts();
  const teamPositionAssignments = await services.getTeamPositionAssignments();
  const previousPlans = await services.getPlans();

  const availablePeople = services.removePeopleWithConflicts(
    conflicts,
    teamPositionAssignments,
    previousPlans
  );

  services.getNeededPositions().then((neededPositions) => {
    const scheduleAssignments = services.generateSchedule(
      neededPositions,
      availablePeople,
      preferences
    );
    // commented out line so that the code doesnt keep running unnecessarily
    services.postSchedule(scheduleAssignments, previousPlans, preferences);
  });
}

main().catch((error) => {
  console.error(error);
});
