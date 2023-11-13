import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { generateSchedule, Schedule } from "./lib/schedule_generator";
import {
  getPlan,
  getNextSunday,
  getCurrentSchedule,
} from "./lib/data_fetch_utils";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/generate-schedule", async (req: Request, res: Response) => {
  const date = req.query.date as string;
  if (date) {
    const schedule: Schedule | void = await generateSchedule(date);
    res.send(schedule);
    console.log("Schedule generated with given date");
  } else {
    console.log(`no date selected. using default value.`);
  }
});

app.get("/get-schedule", async (req: Request, res: Response) => {
  const date = req.query.date as string;
  const plan = await getPlan(getNextSunday(date));
  if (date) {
    const schedule: Schedule | void = await getCurrentSchedule(plan);
    res.send(schedule);
  }
});

app.post("/goodbye", (req: Request, res: Response) => {
  res.send("Goodbye World!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});
