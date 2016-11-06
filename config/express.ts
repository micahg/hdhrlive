import * as express from "express";
import * as channels from "../app/routes/channels";
import * as devices from "../app/routes/devices";
import * as scan from "../app/routes/scan";

export function configure() {
  let app = express();

  app.get("/channels.m3u", channels.get);
  app.get("/devices", devices.get);
  app.get("/scan", scan.get);

  app.use(express.static("./client/public"));
  app.use("/node_modules", express.static("./node_modules"));

  return app;
}

export function run(app: express.Express) {
  const server = app.listen(3000, "localhost", () => {
    const {address, port} = server.address();
    console.log(`Listing on port ${port}`);
  });
  return server;
}
