import { Schedule } from "./schedule_generator";

// used ANSI escape codes to colorize console output
function printScheduleToConsole(schedule: Schedule): void {
  //ANSI escape code for bold text
  console.log(
    "\n\x1b[1m%s\x1b[0m",
    "\tSchedule for the week of: " + _formatDate(schedule.plan_date)
  );
  console.log("\n");
  const maxLength = Math.max(
    ...schedule.team_positions.map((pos) => pos.team_position_name.length)
  );
  for (const teamPosition of schedule.team_positions) {
    const positionMemberArray: string[] = [];
    let positionMemberString: string = "";
    for (const person of teamPosition.team_position_members) {
      positionMemberArray.push(person.person_name);
      positionMemberString = positionMemberArray.join(", ");
    }
    //ANSI escape code for bold, green text
    console.log(
      "\t",
      teamPosition.team_position_name.padEnd(maxLength),
      "\t",
      `\x1b[32m\x1b[1m${positionMemberString}\x1b[0m`
    );
  }
  console.log("\n");
}

function _getDaySuffix(date: Date): string {
  const dayOfMonth = date.getDate();
  if (dayOfMonth >= 11 && dayOfMonth <= 13) {
    return "th";
  }
  switch (dayOfMonth % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function _formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const daySuffix = _getDaySuffix(date);
  const formattedDate = `${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getDate()}${daySuffix}, ${date.getFullYear()}`;
  return formattedDate;
}

export { printScheduleToConsole };
