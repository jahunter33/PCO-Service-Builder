import { ReadLine } from "readline";
import { generateSchedule } from "./lib/schedule_generator";
import { postSchedule } from "./lib/schedule_poster";
import {
  printScheduleError,
  printScheduleToConsole,
} from "./lib/console_utils";
import { printBoldWhite, printTab } from "./lib/console_utils";

import { getPeople } from "./lib/data_fetch_utils";

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

async function songTagger(): Promise<void> {
  printBoldWhite("\nWelcome to the song tagging assistant!");
  printTab(
    "This tool will, by default, tag all songs in the database that have been played at least once within the last year."
  );
  printTab(
    "If you would like to change this, please enter a number of years (less than 10) to look back. Otherwise, press enter to continue."
  );
  //promt user for number of years to look back
  //if user enters a number, use that number
  //if user presses enter, use default value of 1
  //if user enters a non-number, prompt again
  //if user enters a negative number, prompt again
  //if user enters a number greater than 10, prompt again
  //if user enters a decimal, prompt again
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
    rl.close();
    return;
  }

  // Print the schedule to the console
  printScheduleToConsole(schedule);
  if (arePeopleScheduled) {
    const answer: string = await askQuestion(
      "Would you like to post this schedule? (y/n): "
    );
    if (answer === "y") {
      await postSchedule(schedule);
      rl.close();
    } else {
      console.log("Schedule not posted.");
      rl.close();
    }
  } else {
    printScheduleError();
    console.log("No schedule to post.");
    rl.close();
  }
}

main();
