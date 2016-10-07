import * as express from "express";
import * as channels from "../app/routes/channels";

export function configure() {
  let app = express();

  app.get("/channels.m3u", channels.get);

  app.use(express.static("public"));

  return app;
}

export function run(app: express.Express) {
  const server = app.listen(3000, "localhost", () => {
    const {address, port} = server.address();
    console.log(`Listing on port ${port}`);
  });
  return server;
}
