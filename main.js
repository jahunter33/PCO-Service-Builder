const services = require("./service_data_fetch");

async function main() {
  const preferences = require("./preferences.json");
  const people = await services.getPeople();
  const conflicts = await services.getConflicts();
  const teamPositionAssignments = await services.getTeamPositionAssignments();
  const previousPlans = await services.getPlans();

  // services.createPreferences(people);

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
    services.postSchedule(scheduleAssignments, previousPlans, preferences);
  });
}

main().catch((error) => {
  console.error(error);
});
