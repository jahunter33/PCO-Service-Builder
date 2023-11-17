import { ApiResponse } from "./lib/api_utils";
import { printScheduleToDocument } from "./lib/document_utils";
import { getSchedule, generateSchedule } from "./lib/data_fetch_utils";

document.addEventListener("DOMContentLoaded", () => {
  main();
});

async function main() {
  generateCalendar();

  document
    .getElementById("schedule-generate-button")
    ?.addEventListener("click", async () => {
      try {
        const calendar = document.getElementById(
          "calendar"
        ) as HTMLInputElement;
        const date: string = calendar.value;
        const schedule: ApiResponse = await generateSchedule(date);
        console.log(schedule);
        printScheduleToDocument(schedule);
      } catch (error) {
        console.error("Error: ", error);
      }
    });

  document
    .getElementById("schedule-getter-button")
    ?.addEventListener("click", async () => {
      try {
        const calendar = document.getElementById(
          "calendar"
        ) as HTMLInputElement;
        const date: string = calendar.value;
        const schedule: ApiResponse = await getSchedule(date);
        console.log(schedule);
        printScheduleToDocument(schedule);
      } catch (error) {
        console.error("Error: ", error);
      }
    });
}

function generateCalendar() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();

  let day = document.querySelector(".calendar-dates") as HTMLElement;
  let currentDate = document.querySelector(
    ".calendar-current-date"
  ) as HTMLElement;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Function that generates the actual calendar
  const manipulate = () => {
    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();
    let dayEnd = new Date(year, month, lastDate).getDay();
    let previousMonthDate = new Date(year, month, 0).getDate();

    // Temporary variable to store the generated calendar html
    let tableDataArray: Array<string> = [];

    // Add the last days of the previous month
    for (let i = firstDay; i > 0; i--) {
      tableDataArray.push(
        `<td class="inactive">${previousMonthDate - i + 1}</td>`
      );
    }

    // Add the days of the current month
    for (let i = 1; i <= lastDate; i++) {
      // Check if current date is today
      const isToday = (): string => {
        return i === date.getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
          ? "today-active"
          : "active";
      };
      tableDataArray.push(`<td class="${isToday()}">${i}</td>`);
    }

    // Add the first few days of the next month
    for (let i = dayEnd; i < 6; i++) {
      tableDataArray.push(`<td class="inactive">${i - dayEnd + 1}</td>`);
    }

    // Update text of current date element with formatted month and year
    currentDate.innerText = `${months[month]} ${year}`;

    // group every 7 days into a row and update calendar dates text
    for (let i = 0; i < tableDataArray.length; i += 9) {
      tableDataArray.splice(i, 0, `<tr>`);
      tableDataArray.splice(i + 8, 0, `</tr>`);
    }

    const calendarDatesString: string = tableDataArray.join("");
    day.innerHTML = calendarDatesString;
  };

  manipulate();
}
