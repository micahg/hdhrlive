import * as express from "express";
import * as bodyParser from "body-parser";
import * as channels from "../app/routes/channels";
import * as devices from "../app/routes/devices";
import * as scan from "../app/routes/scan";
import * as config from "./config";

export function configure() {
  let app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get("/channels.m3u", channels.getChannelsM3U);
  app.get("/channels.json", channels.getChannelsJSON);
  app.get("/channel", channels.getChannel);
  app.delete("/channel/:device/:freq/:prog", channels.deleteChannel);
  app.get("/channels", channels.getChannels);
  app.get("/scandevices", devices.scan);
  app.get("/devices", devices.get);
  app.get("/scan", scan.get);

  app.use(express.static("./public"));
  app.use("/node_modules", express.static("./node_modules"));

  return app;
}

export function run(app: express.Express) {

  const server = app.listen(config.port, config.address, () => {
    const {address, port} = server.address();
    console.log(`Listing on port ${address}:${port}`);
  });

  return server;
}
