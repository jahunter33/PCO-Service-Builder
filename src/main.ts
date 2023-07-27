import { ReadLine } from "readline";
import { generateSchedule } from "./lib/schedule_generator";
import { postSchedule } from "./lib/schedule_poster";
import { printScheduleToConsole } from "./lib/console_utils";

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
  if (schedule !== undefined) {
    printScheduleToConsole(schedule);
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
    console.log("No schedule to post.");
    rl.close();
  }
}

main();
