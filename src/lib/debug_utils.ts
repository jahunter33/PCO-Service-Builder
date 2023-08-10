import * as fs from "fs";

function writeJson(data: any[], fileName: string): void {
  // this is not the correct directory location to which the file should be written
  fs.mkdir("./data", { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory: ", err);
    } else {
      fs.writeFile(
        `./data/${fileName}`,
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
