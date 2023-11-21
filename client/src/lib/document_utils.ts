import { ApiResponse } from "./api_utils";

function printScheduleToDocument(schedule: ApiResponse): void {
  const scheduleContainer = document.getElementById("schedule") as HTMLElement;

  const positionMemberMap: Map<string, string[]> = new Map();

  for (const teamPosition of schedule.data.team_positions) {
    for (let i = 0; i < teamPosition.team_position_members.length; i++) {
      const positionName: string = teamPosition.team_position_name;
      const personName: string =
        teamPosition.team_position_members[i].person_name;
      if (positionMemberMap.has(positionName)) {
        positionMemberMap.get(positionName)!.push(personName);
      } else {
        positionMemberMap.set(positionName, [personName]);
      }
    }
  }

  const sortedPositionNames: string[] = Array.from(
    positionMemberMap.keys()
  ).sort();

  let displayString: string = "";
  for (const positionName of sortedPositionNames) {
    displayString += positionName + "\n";
    const members: string[] | undefined = positionMemberMap.get(positionName);
    if (members) {
      for (const member of members) {
        displayString += "-" + member + "\n";
      }
    }
    displayString += "\n";
  }
  scheduleContainer.innerText = displayString.trim();
}

export { printScheduleToDocument };
