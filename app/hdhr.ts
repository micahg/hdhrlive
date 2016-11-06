import * as childProcess from "child_process";

class ScanStatus {
  isScanning: boolean;
  percentComplete: number;
  error: string;

  constructor(scanning: boolean, progress: number) {
    this.isScanning = scanning;
    this.percentComplete = (100 * (progress / 67)) | 0;
  }
}

let isScanning = false;
let chanNum = 67;


export function scan(device: string, operation: string): ScanStatus {

  // if presently scanning, just return the flag indicating so
  if (isScanning || operation === "status") {
    return new ScanStatus(isScanning, chanNum);
  }

  // make sure its scan
  if (operation !== "start") {
    let status = new ScanStatus(false, chanNum);
    status.error = "Unknown operation";
    console.log(status.error);
    return status;
  }

  // hdhomerun_config 10319F74 scan 1
  const scanner = childProcess.spawn("hdhomerun_config", [device, "scan", "1"]);

  isScanning = true;
  chanNum = 0;

  /**
   * The channel set command is going to look like:
   *
   *     hdhomerun_config 10319F74 set /tuner0/channel 195000000
   *
   * at the very least, we need to store the frequency number (eg: 195000000)
   * but probably also the broadcast. For the m3u8, we'll want the program data
   */

  // parse off all the units
  let freq = null;
  scanner.stdout.on("data", (data) => {

    chanNum++;
    // split the string into lines (to handle multiple PROGRAMs)
    for (let line of data.toString().split("\n")) {

      // see about the programs
      let programs = /PROGRAM (\d): (.*)/g.exec(line);
      if (programs != null) {
        let program_num = programs[1];
        let program_name = programs[2];
        console.log(`${program_name} (${program_num}) on ${freq}`);
      }

      // the way the output comes through its important that the search for the
      // LOCK comes first. This is because the lock info comes in the same string
      // as the next channel frequency
      let scans = /SCANNING: (.*?) .*/g.exec(line);
      if (scans != null) {
        freq = scans[1];
        console.log(`Setting frequency to ${freq}`);
      }
    }
  });

  scanner.on("close", (code) => {
    console.log("discovery complete");
    isScanning = false;
    chanNum = 67;
  });

  return new ScanStatus(true, chanNum);
}
