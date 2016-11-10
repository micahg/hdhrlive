export class Channel {

  // the channel name (31.1 Citytv)
  name: string;

  // the program number (sub-channel)
  num: string;

  // channel frequency
  freq: string;

  constructor(channelName: string,
              channelNumber: string,
              channelFrequency: string) {

    this.name = channelName;
    this.num = channelNumber;
    this.freq = channelFrequency;
  }

};
