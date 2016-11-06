import * as express from "express";
import * as hdhr from "../hdhr";

export function get(req: express.Request, res: express.Response) {

  // ensure a device is specified
  if (!("device" in req.query)) {
    console.log("No device specified");
    res.status(400).send("No device specified");
    return;
  }

  // check the operation (eg: status or start)
  if (!("operation" in req.query)) {
    console.log("No operation specified");
    res.status(400).send("No operation specified");
    return;
  }

  let scanStatus = hdhr.scan(req.query.device, req.query.operation);
  res.status(200).json(scanStatus);
}
