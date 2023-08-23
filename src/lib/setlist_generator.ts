import { Song, getSongs } from "./data_fetch_utils";

async function generateSetlist(): Promise<void> {
  const songArray: Song[] = [];
  const songs = await getSongs();
  for (const song of songs) {
    songArray.push(song);
  }
  const setlistArray: String[] = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex: number = Math.floor(Math.random() * songArray.length);
    const randomSong: Song = songArray[randomIndex];
    setlistArray.push(randomSong.song_title);
    songArray.splice(randomIndex, 1);
  }
  console.log(setlistArray);
}

export { generateSetlist };
