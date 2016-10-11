import * as express from "express";
import * as childProcess from "child_process";

export function get(req: express.Request, res: express.Response) {
  const discover = childProcess.spawn("hdhomerun_config", ["discover"]);

  // parse off all the units
  discover.stdout.on("data", (data) => {
    let devRegex = /device (.*?) found/g;
    let output = data.toString();
    let ids = devRegex.exec(output);
    console.log(`Device ID is ${ids[1]}`);
  });

  discover.on("close", (code) => {
    console.log("discovery complete");
    res.send("done");
  });
}
