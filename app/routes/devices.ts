import * as express from "express";
import * as childProcess from "child_process";

import * as hdhr from "../hdhr";

/**
 * Start scanning for HDHomeRun Deviecs
 */
export function scan(req: express.Request, res: express.Response) {
  hdhr.scanDevices((devices) => {
    res.json(devices);
  });
}

export function get(req: express.Request, res: express.Response) {
  console.log("Getting devices...");
  let devices: string[] = hdhr.getDevices();
  res.json(devices);
}
