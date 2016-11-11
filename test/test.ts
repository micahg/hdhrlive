import * as mocha from "mocha";
import { assert, expect } from "chai";
import * as fs from "fs";

import * as hdhr from "../app/hdhr";
import { Device } from "../app/device";
let firstDevice: Device = {"id": "AAAAAAAA", "channels": [{"name": "51.1 CHCH-DT", "num": "3", "freq": "695000000"}, {"name": "69.1 OMNI1", "num": "2", "freq": "677000000"}, {"name": "10.1 CFPL", "num": "1", "freq": "195000000"}]};
let testData1 = [firstDevice];
let secondDevice: Device = {"id": "BBBBBBBB", "channels": [{"name": "31.1 Citytv", "num": "2", "freq": "575000000"}, {"name": "18.1 TVO", "num": "1", "freq": "497000000"}, {"name": "6.1 CIII-HD", "num": "1", "freq": "491000000"}]};

describe("hdhr", function() {

  // set result loading a non-existant file
  describe("load zero", function() {
    it("Should load empty device array", () => {
      // first get rid of any existing channels
      if (fs.existsSync("/tmp/channels.json")) {
        fs.unlinkSync("/tmp/channels.json");
      }
      expect(hdhr.loadDevices().length).to.equal(0);
    });
  });

  // load a file with one device
  describe("load one", function() {

    fs.writeFileSync("/tmp/channels.json", JSON.stringify(testData1));
    let devices: Device[] = hdhr.loadDevices();

    it ("Should load one device", () => {
      expect(devices.length).to.equal(1);
    });

    it ("Should load device ID AAAAAAAA", () => {
      expect(devices[0].id).to.equal("AAAAAAAA");
    });

    it ("Should load three channels for device 10319F74", () => {
      expect(devices[0].channels.length).to.equal(3);
    });

    it ("Should load have a frequency of 695000000 for the first channel of 10319F74", () => {
      expect(devices[0].channels[0].freq).to.equal("695000000");
    });

    it ("Should load have a program number of 2 for the second channel of 10319F74", () => {
      expect(devices[0].channels[1].num).to.equal("2");
    });

    it ("Should load have a name of 10.1 CFPL for the third channel of 10319F74", () => {
      expect(devices[0].channels[2].name).to.equal("10.1 CFPL");
    });
  });

  describe("load another", function() {
    hdhr.saveDevice(secondDevice);
    let devices: Device[] = hdhr.loadDevices();

    it ("Should load two devices", () => {
      expect(devices.length).to.equal(2);
    });

    it ("Should have a first device named AAAAAAAA", () => {
      expect(devices[0].id).to.equal("AAAAAAAA");
    });

    it ("Should have a second device named BBBBBBBB", () => {
      expect(devices[1].id).to.equal("BBBBBBBB");
    });
  });
});
