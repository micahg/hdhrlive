import * as express from "express";

/**
 * Channel class. Used to encapsulate channel data.
 */
class Channel {
  channelId: string;
  channelName: string;

  constructor(id: string, name: string) {
    this.channelId = id;
    this.channelName = name;
  }

  toM3U() {
    return `#EXTINF:-1 tvg-id="${this.channelId}" tvg-name="${this.channelName}"\n`;
  }
}

function channelList(channels: Channel[]) {
  let list = "#EXTM3U\n";
  for (let channel of channels) {
    list += channel.toM3U();
  }

  return list;
}

export function get(req: express.Request, res: express.Response) {
  console.log("get request for channle list");

  let c1 = new Channel("c1", "Global");
  let c2 = new Channel("c2", "CTV");

  res.send(channelList([c1, c2]));
}
