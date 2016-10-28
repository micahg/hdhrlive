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
    this.hdhrService.getDevices()
    .then(devs => {
      console.log(`Devices  ${JSON.stringify(devs)}`);
      this.devices = devs;
    })
    .catch(error => {
      console.error("Unable to get devices.");
    });
  }

  /**
   * Scan channels on a device.
   */
   scanChannels(device: string) {
     console.log(`Scanning device ${device}`);
   }
}
