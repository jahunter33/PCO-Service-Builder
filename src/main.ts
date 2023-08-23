import { ReadLine } from "readline";
import { generateSchedule } from "./lib/schedule_generator";
import { postSchedule } from "./lib/schedule_poster";
import {
  printScheduleError,
  printScheduleToConsole,
} from "./lib/console_utils";
import { generateSetlist } from "./lib/setlist_generator";
import { getSongs } from "./lib/data_fetch_utils";

const rl: ReadLine = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  const date: string = await askQuestion(
    "Please enter the date you would like, or press enter (YYYY-MM-DD format): "
  );
  let schedule: any;
  if (date === "") {
    schedule = await generateSchedule();
  } else {
    schedule = await generateSchedule(date);
  }

  let arePeopleScheduled: boolean = false;
  if (schedule !== undefined) {
    for (const teamPosition of schedule.team_positions) {
      if (teamPosition.team_position_members.length > 0) {
        arePeopleScheduled = true;
        break;
      }
    }
  } else {
    console.log("No schedule to post.");
  }

  // Print the schedule to the console
  if (arePeopleScheduled) {
    printScheduleToConsole(schedule);
    const answer: string = await askQuestion(
      "Would you like to post this schedule? (y/n): "
    );
    if (answer === "y") {
      await postSchedule(schedule);
    } else {
      console.log("Schedule not posted.");
      rl.close();
      return;
    }
  }

  // Print the setlist to the console
  if (arePeopleScheduled) {
    const setlistAnswer: string = await askQuestion(
      "Would you like to generate a setlist? (y/n): "
    );
    if (setlistAnswer === "y") {
      await generateSetlist();
    }
    rl.close();
  } else {
    const setlistAnswer: string = await askQuestion(
      "There is no schedule currently to generate a setlist. Would you like to generate a setlist anyway? (y/n): "
    );
    if (setlistAnswer === "y") {
      await generateSetlist();
    }
    rl.close();
  }
}

getSongs();
//main();
