import {
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
} from "./data_fetch_utils";

interface Schedule {
  plan_id: string;
  plan_date: string;
  team_positions: PositionAssignment[];
}

// main component of schedule generator
async function generateSchedule(
  date?: Date | string
): Promise<Schedule | void> {
  const scheduleTeamPositions: PositionAssignment[] = [];
  const plan: Plan[] = await getPlan(getNextSunday(date));

  console.log("Generating schedule...");
  const people: Person[] = await getPeople();
  const teamPositions: TeamPosition[] = await getTeamPositions();
  const teamPositionAssignments: PositionAssignment[] =
    await getTeamPositionAssignments(people, teamPositions);
  const conflicts: Conflict[] = await getConflicts(people, plan);
  let availablePeople: PositionAssignment[] = await _removePeopleWithConflicts(
    teamPositionAssignments,
    conflicts
  );
  const neededPositions: NeededPositions[] = await getNeededPositions(plan);
  if (neededPositions.length === 0) {
    console.log("No positions needed.");
    return;
  }
  for (const position of neededPositions) {
    const positionIndex: number = availablePeople.findIndex(
      (element) => element.team_position_name === position.needed_position
    );
    const positionAssignment: PositionAssignment =
      availablePeople[positionIndex];
    const peopleWithHighestPriority: Person[] =
      _getPeopleWithHighestPriority(positionAssignment);
    const scheduledPeople: Person[] = _randomizePeople(
      peopleWithHighestPriority,
      position.quantity_needed
    );
    availablePeople = _removeDuplicates(availablePeople, scheduledPeople);
    const scheduledPosition: PositionAssignment = {
      team_position_name: positionAssignment.team_position_name,
      team_position_members: scheduledPeople.map(
        (person) => person.person_name
      ),
    };
    scheduleTeamPositions.push(scheduledPosition);
  }
  const schedule: Schedule = {
    plan_id: plan[0].plan_id,
    plan_date: plan[0].plan_date,
    team_positions: scheduleTeamPositions,
  };
  console.log(schedule);
  return schedule;
}

async function _removePeopleWithConflicts(
  positionAssignments: PositionAssignment[],
  conflicts: Conflict[]
): Promise<PositionAssignment[]> {
  const availablePeople: PositionAssignment[] = [];
  for (const assignment of positionAssignments) {
    const teamPositionAssignment: PositionAssignment = {
      team_position_name: assignment.team_position_name,
      team_position_members: [],
    };
    for (const person of conflicts) {
      if (
        person.conflicts.length === 0 &&
        assignment.team_position_members.includes(person.person_name)
      ) {
        teamPositionAssignment.team_position_members.push(person.person_name);
      }
    }
    availablePeople.push(teamPositionAssignment);
  }
  return availablePeople;
}

// function to get people with highest priority
// FIXME: this function can't handle a scenario where there are not enough people of highest priority to fill a position
function _getPeopleWithHighestPriority(people: PositionAssignment): Person[] {
  const preferences: any[] = require("./data/preferences.json");
  let highestPriority: number = 1;
  const highestPriorityPeopleArray: Person[] = [];
  for (const person of people.team_position_members) {
    const personIndex: number = preferences.findIndex(
      (element) => element.person_name === person
    );
    const personPriority: number = preferences[personIndex].priority;
    if (personPriority > highestPriority) {
      highestPriority = personPriority;
      highestPriorityPeopleArray.length = 0;
      const highestPriorityPerson: Person = {
        person_id: preferences[personIndex].person_id,
        person_name: preferences[personIndex].person_name,
      };
      highestPriorityPeopleArray.push(highestPriorityPerson);
    } else if (personPriority === highestPriority) {
      const highestPriorityPerson: Person = {
        person_id: preferences[personIndex].person_id,
        person_name: preferences[personIndex].person_name,
      };
      highestPriorityPeopleArray.push(highestPriorityPerson);
    }
  }
  return highestPriorityPeopleArray;
}

// simple randomizer function
function _randomizePeople(people: Person[], quantity: number): Person[] {
  const randomizedPeople: Person[] = [];
  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * people.length);
    randomizedPeople.push(people[randomIndex]);
    people.splice(randomIndex, 1);
  }
  return randomizedPeople;
}

// function to remove people who have already been scheduled for a position from the list of available people
function _removeDuplicates(
  people: PositionAssignment[],
  scheduledPeople: Person[]
): PositionAssignment[] {
  for (const person of scheduledPeople) {
    for (const positionAssignment of people) {
      if (
        positionAssignment.team_position_members.includes(person.person_name)
      ) {
        const personIndex: number =
          positionAssignment.team_position_members.findIndex(
            (element) => element === person.person_name
          );
        positionAssignment.team_position_members.splice(personIndex, 1);
      }
    }
  }

  return people;
}

export { Schedule, generateSchedule };
