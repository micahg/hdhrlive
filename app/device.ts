import { Channel } from "./channel";

export class Device {
  id: string;
  channels: Channel[];

  constructor(deviceID: string, deviceChannels: Channel[]) {
    this.id = deviceID;
    this.channels = deviceChannels;
  }

}
