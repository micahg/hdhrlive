import * as fs from "fs";
import * as childProcess from "child_process";
import * as os from "os";
import * as express from "express";

import { Channel } from "./channel";
import { Device } from "./device";

let isScanning = false;
let chanNum = 67;
let channels: Channel[];
let devices: Device[] = null;

class ScanStatus {
  isScanning: boolean;
  percentComplete: number;
  error: string;
  channels: string[];

  constructor(scanning: boolean, progress: number) {
    this.isScanning = scanning;
    this.percentComplete = (100 * (progress / 67)) | 0;
  }
}

/**
 * Get the devices already loaded.
 */
export function getDevices(): string[] {
  let devices: Device[] = loadDevices();
  let result: string[] = [];

  for (let device of devices) {
    result.push(device.id);
  }

  return result;
}


/**
 * Scan for devices.
 */
export function scanDevices(callback: (devices: string[]) => any) {
  let devs: string[] = [];
  const discover = childProcess.spawn("hdhomerun_config", ["discover"]).on("error", (error) => {
    console.log(error);
  });

  // parse off all the units
  discover.stdout.on("data", (data) => {
    console.log(`${data}`);
    let devRegex = /device (.*?) found/g;
    let output = data.toString();
    let ids = devRegex.exec(output);
    if (ids == null) {
      console.log("No devices found");
    } else {
      console.log(`result is ${ids}`);
      console.log(`Device ID is ${ids[1]}`);
      devs.push(ids[1]);
    }
  });

  discover.on("close", (code) => {
    callback(devs);
  });
}


/**
 * Get the list of scanned channels.
 */
export function getChannels(deviceID: string): Channel[] {
  let devices: Device[] = loadDevices();
  let channels: Channel[] = [];

  for (let device of devices) {
    if (deviceID === device.id) {
      return device.channels;
    }
  }

  return channels;
}


/**
 * Scan for channels on a device. This is a long process, so this method returns
 * a status and a percentage complete (so the frontend can poll).
 *
 * @param device the device id.
 * @param operation the operation (start or status)
 */
export function scanChannels(deviceID: string, operation: string): ScanStatus {

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
  const scanner = childProcess.spawn("hdhomerun_config", [deviceID, "scan", "1"]).on("error", (error) => {
    console.log(error);
  });

  isScanning = true;
  chanNum = 0;

  // this resets the arry
  channels = [];

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

        let chan = new Channel(program_name, program_num, freq);
        console.log(`${program_name} (${program_num}) on ${freq}`);

        channels.push(chan);
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
    // let channelFile = `${os.tmpdir()}/channels.json`;
    let device = new Device(deviceID, channels);
    console.log("discovery complete");
    saveDevice(device);
    isScanning = false;
    chanNum = 67;
  });

  return new ScanStatus(true, chanNum);
}

export function setChannel(deviceID: string, freq: string, callback: () => any) {
  // hdhomerun_config 10319F74 set /tuner0/channel auto:491000000
  let params: any[] = [deviceID, "set", "/tuner0/channel", `auto:${freq}`];
  console.log(`Running \`hdhomerun_config ${params.join(' ')}\``);
  const tuner = childProcess.spawn("hdhomerun_config", params);

  tuner.on("close", (code) => {
    console.log(`Channel set (${code})`);
    callback();
  });
}

export function setTarget(deviceID: string, ip: string, port: string) {
  // hdhomerun_config 10319F74 set /tuner0/target 192.168.0.171:5000
  let params: any[] = [deviceID, "set", "/tuner0/target", `${ip}:${port}`];
  console.log(`Running \`hdhomerun_config ${params.join(' ')}\``);
  const target = childProcess.spawn("hdhomerun_config", params);

  target.on("close", (code) => {
    console.log(`Targetted (${JSON.stringify(code)})`);
  });
}

export function loadDevices(): Device[] {

  devices = [];

  let filename: string = `${os.tmpdir()}/channels.json`;
  try {
    devices = JSON.parse(fs.readFileSync(filename).toString());
  } catch (err) {
    devices = [];
  }

  return devices;
}

export function saveDevice(device: Device) {
  // TODO think of a better place to save this. Maybe configurable?
  let filename = `${os.tmpdir()}/channels.json`;
  let oldDevices: Device[] = loadDevices();
  let devices: Device[] = [];

  for (let oldDevice of oldDevices) {
    if (oldDevice.id !== device.id) {
      devices.push(oldDevice);
    }
  }

  devices.push(device);
  fs.writeFileSync(filename, JSON.stringify(devices));
}

export function buildM3U(baseUrl: string, ip: any): string {
  let devices: Device[] = loadDevices();
  let m3u: string = "#EXTM3U\n";
  let app = express();

  for (let device of devices) {
    for (let channel of device.channels) {
      let id: string = `${device.id}_${channel.freq}_${channel.num}`;
      let name: string = channel.name;
      m3u += `#EXTINF:-1 tvg-id="${id}" tvg-name="${name}",${name}\n`;
      m3u += `${baseUrl}/channel?device=${device.id}&freq=${channel.freq}&prog=${channel.num}\n`;
    }
  }

  return m3u;
}

export function buildJSON(baseUrl: string): Device[] {
  let items = [];
  for (let device of loadDevices()) {
    for (let channel of device.channels) {
      let item = {
        url: `${baseUrl}/channel?device=${device.id}&freq=${channel.freq}&prog=${channel.num}`,
        name: channel['name']
      }
      items.push(item);
    }
  }

  return items;
}

export function deleteChannel(deviceID: string, freq: string, prog: string): boolean {
  let devices: Device[] = loadDevices();

  for (let device of devices) {
    if (device.id !== deviceID) {
      continue;
    }

    let channels: Channel[] = device.channels;
    let idx: number = 0;

    for (let channel of channels) {
      if ((channel.freq === freq) && (channel.num === prog)) {
        console.log(`Deleting channel ${JSON.stringify(channel)}`);
        break;
      }
      idx++;
    }

    channels.splice(idx, 1);
    saveDevice(device);

    return true;
  }

  console.log(`Unable to delete ${freq}:${prog} from ${deviceID}`);

  return false;
}
