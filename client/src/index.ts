import { ApiResponse } from "./lib/api_utils";
import { printScheduleToDocument } from "./lib/document_utils";
import { getSchedule, generateSchedule } from "./lib/data_fetch_utils";

document.addEventListener("DOMContentLoaded", () => {
  main();
});

async function main() {
  initializeCalendar();

  // add event listeners to calendar dates
  initializeCalendarEvents();
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

function initializeCalendar(): void {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();

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

  // Attach an event listener to each icon
  prenextIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      // Check if icon clicked is calendar-prev or calendar-next
      month = icon.id === "calendar-prev" ? month - 1 : month + 1;

      // Check if month is out of range, set new date according to the next or previous year
      if (month < 0 || month > 11) {
        date = new Date(year, month, new Date().getDate());
        year = date.getFullYear();
        month = date.getMonth();
      } else {
        // Set date to current date
        date = new Date();
      }
      // Update calendar display
      manipulate();
    });
  });
}

// adds event listeners to each day in calendar
function initializeCalendarEvents(): void {
  const calendarDays = document.querySelectorAll(".calendar-dates tr td");
  calendarDays.forEach((day) => {
    day.addEventListener("click", () => {
      if (day.classList.contains("active")) {
        day.classList.replace("active", "today-active");
      }
    });
  });
}
