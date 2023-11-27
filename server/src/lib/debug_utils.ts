import * as fs from "fs";

function writeJson(data: string[], fileName: string): void {
  // this is not the correct directory location to which the file should be written
  fs.mkdir("./server/data", { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory: ", err);
    } else {
      fs.writeFile(
        `./server/data/${fileName}`,
        JSON.stringify(data, null, 4),
        (err) => {
          if (err) {
            console.error("Error writing to file: ", err);
          } else {
            console.log(`JSON saved to ${fileName}`);
          }
        }
      );
    }
  });
}

export { writeJson };
