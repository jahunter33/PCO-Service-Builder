/**
 * Ideas:
 *
 *
 * Maybe it could check to see if the next service corresponds with the selected
 * date, and if not, the message text says "There is no plan for the date of [],
 * but would you like to generate a plan for the next service on []?
 *
 * the logic to print the date to the screen will be similar logic to get the
 * date over to the schedule generator
 *
 * when you click on a date not in this month the selection goes away. it should switch
 * to that month and the date should be selected appropriately
 *
 */

import { ApiResponse } from "./lib/api_utils";
import { printScheduleToDocument } from "./lib/document_utils";
import { getSchedule, generateSchedule } from "./lib/data_fetch_utils";

interface GlobalDate {
  date: string;
}

const globalDate: GlobalDate = {
  date: "",
};

document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main(): void {
  // Initialize calendar
  initializeCalendar();
  // set up schedule buttons
  initializeScheduler();
}

function initializeCalendar(): void {
  // current date
  let date: Date = new Date();
  let year: number = date.getFullYear();
  let month: number = date.getMonth();

  const day = document.querySelector(".calendar-dates") as HTMLElement;
  const currentDate = document.querySelector(
    ".calendar-current-date"
  ) as HTMLElement;
  const prenextIcons = document.querySelectorAll(
    ".calendar-navigation span"
  ) as NodeListOf<HTMLElement>;

  const months: Array<string> = [
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
    let firstDay: number = new Date(year, month, 1).getDay();
    let lastDate: number = new Date(year, month + 1, 0).getDate();
    let dayEnd: number = new Date(year, month, lastDate).getDay();
    let previousMonthDate: number = new Date(year, month, 0).getDate();

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

    // Attach listeners to each calendar for selecting a date
    const calendarDays: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".calendar-dates tr td"
    );

    // Initial date and last clicked date printed to screen
    let formattedDate: string = formatDate(date);
    let selectedDate = document.getElementById("selected-date") as HTMLElement;
    selectedDate.innerHTML = formattedDate;
    globalDate.date = formattedDate;

    calendarDays.forEach((day) => {
      day.addEventListener("click", () => {
        // Remove the current active day
        calendarDays.forEach((otherDay) => {
          if (otherDay.classList.contains("today-active"))
            otherDay.classList.replace("today-active", "active");
        });
        // Set new active day
        if (day.classList.contains("active")) {
          day.classList.replace("active", "today-active");

          //code to change formattedDate to the current one
          const newDay = day.innerHTML;
          date = new Date(`${month + 1} ${newDay}, ${year}`);
          formattedDate = formatDate(date);
          selectedDate.innerHTML = formattedDate;
          globalDate.date = formattedDate;
        }
      });
    });
  };

  manipulate();

  // Attach an event listener to each icon
  prenextIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      // Check if icon clicked is calendar-prev or calendar-next
      month = icon.id === "calendar-prev" ? month - 1 : month + 1;
      // Check if month is out of range
      if (month < 0 || month > 11) {
        let newDate = new Date(year, month, new Date().getDate());
        year = newDate.getFullYear();
        month = newDate.getMonth();
      }
      manipulate();
    });
  });
}

function initializeScheduler(): void {
  const date: string = convertDateFormat(globalDate.date);
  document
    .getElementById("schedule-generate-button")
    ?.addEventListener("click", async () => {
      try {
        const schedule: ApiResponse = await generateSchedule(date);
        printScheduleToDocument(schedule);
      } catch (error) {
        console.error("Error: ", error);
      }
    });

  document
    .getElementById("schedule-getter-button")
    ?.addEventListener("click", async () => {
      try {
        const schedule: ApiResponse = await getSchedule(date);
        printScheduleToDocument(schedule);
      } catch (error) {
        console.error("Error: ", error);
      }
    });
}

function convertDateFormat(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
