import { Song, getSongs } from "./data_fetch_utils";

//calling getSongs function here and in the schedule generator as well, since they might not be called in the same instance
async function createSongTags(years: number = 1): Promise<void> {
  // gets all songs that have been played in the last year (or user-specified number of years) and songs that do not already have tags
  // FIXME: wrong query params
  const untaggedSongs: Song[] = await getSongs({ tagged: "false" });

  console.log(untaggedSongs);
}
