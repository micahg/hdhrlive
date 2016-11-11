import { Channel } from "./channel";

export class Device {
  deviceID: string;
  channels: Channel[];

  constructor(id: string, deviceChannels: Channel[]) {
    this.deviceID = id;
    this.channels = deviceChannels;
  }

}
