import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";
import * as querystring from "querystring";

// import "rxjs/add/operator/toPromise";
// import * as Rx from "rxjs/Observable";
// import "rxjs/Rx";
import "rxjs/add/operator/toPromise";

@Injectable()
export class HDHRService {

  constructor(private http: Http) { }

  loadDevices(success: (devices: string[]) => any) {
    this.http.get("/devices").subscribe(
      (response) => success(response.json() as string[]),
      (error) => success([]), // TODO this is probably a bad choice
      () => console.log("Devices loaded.")
    );
  }

  scanDevices(success: (response: string[]) => any,
              failure: (error: string) => any) {
    this.http.get("/scandevices").subscribe(
      (response) => success(response.json() as string[]),
      (error) => failure(error),
      () => console.log("Device scan complete.")
    );
  }

  loadChannels(device: string,
               success: (channels: any[]) => any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("device", device);
    this.http.get("/channels", {search: params}).subscribe(
      (response) => success(response.json()),
      (error) => success([]),
      () => console.log("Channels loaded.")
    );
  }

  scanChannels(device: string,
               success: (channels: any) => any,
               failure: (error: string) => any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("device", device);
    params.set("operation", "start");

    this.http.get("/scan", {search: params}).subscribe(
      (response) => {
        console.log(`Scan response is ${JSON.stringify(response.json())}`);
        success(response.json());
      },
      (error) => failure(error),
      () =>  {}
    );
  }

  channelScanStatus(device: string,
                    success: (channels: any) => any,
                    failure: (error: string) => any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("device", device);
    params.set("operation", "status");

    this.http.get("/scan", {search: params}).subscribe(
      (response) => {
        success(response.json());
      },
      (error) => failure(error),
      () => {}
    );
  }

  /**
   * Call the channel deletion api.
   */
  deleteChannel(device: string, channel: any,
                callback: (success: boolean) => any) {

    let path = `/channel/${device}/${channel.freq}/${channel.num}`;
    let data = { "device" : device, "channel" : channel };
    console.log(`Service delete ${path}`);

    this.http.delete(path).subscribe(
      (response) => callback(true),
      (error) => callback(false),
      () => {}
    );

    /*this.http.delete("/channel").subscribe(
      (response) => callback(true),
      (error) => callback(false),
      () => {}
    );*/

    /*this.http.post("/channel", data).subscribe(
      (response) => {
        callback(true);
      },
      (error) => {
        callback(false);
      },
      () => {});*/
  }
}
