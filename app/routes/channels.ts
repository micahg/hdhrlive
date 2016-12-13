import { Request, Response }  from "express";
import * as hdhr from "../hdhr";
// import * as childProcess from "child_process";

export function getM3U(req: Request, res: Response) {
  let baseUrl: string = `${req.protocol}://${req.headers["host"]}`;
  console.log("get request for channel list");
  let m3u: string = hdhr.buildM3U(baseUrl);
  console.log(`M3U is...\n${m3u}`);
  res.send(m3u);
}


export function getChannels(req: Request, res: Response) {

  // ensure the device is specified in the query
  if (!("device" in req.query)) {
    console.log("[getChannels] No device specified");
    res.status(400).send("No device specified");
    return;
  }

  res.json(hdhr.getChannels(req.query.device));
}


export function getChannel(req: Request, res: Response) {

  // ensure the device is specified in the query
  if (!("device" in req.query)) {
    console.log("No device specified");
    res.status(400).send("No device specified");
    return;
  }

  // ensure there is a frequency specified in the query
  if (!("freq" in req.query)) {
    console.log("No frequency specified");
    res.status(400).send("No frequency specified.");
    return;
  }

  // ensure there is a program specified
  if (!("prog" in req.query)) {
    console.log("No program number specified");
    res.status(400).send("No program number specified");
    return;
  }


  hdhr.setChannel(req.query.device, req.query.freq, () => {
    console.log("Tuning successful, redirecting...");
    res.redirect("udp://:5000");
    setTimeout(() => {
      // start broadcasting
      console.log(`IP is ${JSON.stringify(req.ip)}`);
      hdhr.setTarget(req.query.device, req.ip, "5000");
    }, 500);
  });
}


export function deleteChannel(req: Request, res: Response) {

  if (!("device" in req.params)) {
    console.log("No device spefieid in delete.");
    res.status(400).send("No device in DELETE request");
    return;
  }

  if (!("freq" in req.params)) {
    console.log("No frequency specified for delete.");
    res.status(400).send("No frequency in DELETE request");
    return;
  }

  if (!("prog" in req.params)) {
    console.log("No program ID specified for delete");
    res.status(400).send("No program ID specified for delete");
    return;
  }

  hdhr.deleteChannel(req.params.device, req.params.freq, req.params.prog);
  console.log(`Deleting ${JSON.stringify(req.params)}`);
  res.status(200).send();
}
