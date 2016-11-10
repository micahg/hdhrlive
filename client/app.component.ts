import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";

import { HDHRService } from "./hdhr.service";

@Component({
  selector: "my-app",
  // even though this is in the same folder in version control, we need the
  // relative path at runtime, which is in the app folder.
  templateUrl: "./app/app.component.html"
})

export class AppComponent {

  devices = [];

  constructor(private hdhrService: HDHRService) { }

  /**
   * Scan for devices.
   */
  scanDevices() {
    console.log("Scannign for devices...");

    this.hdhrService.scanDevices((devices: string[]) => {
      console.log(`Devices ${JSON.stringify(devices)}`);
      this.devices = devices;
    }, (error: string) => {
      console.log(`Unable to scan devices: ${error}`);
    });
  }

  /**
   * Scan channels on a device.
   */
   scanChannels(device: string) {
     console.log(`Scanning device ${device}...`);

     this.hdhrService.scanChannels(device,
       (result: any) => {
       console.log(`Channel scan returns ${result}`);
       if (result.isScanning === true) {
         console.log("Scanning is ongoing -- setup pollling");
       }
     }, (error: string) => {
       console.log(`Channel scan fails: ${error}`);
     });
   }
}
