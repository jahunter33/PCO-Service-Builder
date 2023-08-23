import { Song, getSongs } from "./data_fetch_utils";
import { printBoldWhite, printTab } from "./console_utils";

//calling getSongs function here and in the schedule generator as well, since they might not be called in the same instance
async function createSongTags(years: number = 1): Promise<void> {
  // gets all songs that have been played in the last year (or user-specified number of years) and songs that do not already have tags
  // FIXME: wrong query params
  const untaggedSongs: Song[] = await getSongs();

  console.log(untaggedSongs);
}

async function songTagAssistant(): Promise<void> {
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
