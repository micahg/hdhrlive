import * as process from "process";
import * as dev from "./env/development";
import * as prod from "./env/production";

let _address = dev.address;
let _port = dev.port;

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "production") {
  _address = prod.address;
  _port = prod.port;
}

console.log(`Configuration set for ${process.env.NODE_ENV}`);

export const address = _address;
export const port = _port;
