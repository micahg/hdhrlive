import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

// import "rxjs/add/operator/toPromise";
// import * as Rx from "rxjs/Observable";
// import "rxjs/Rx";
import "rxjs/add/operator/toPromise";

@Injectable()
export class HDHRService {

  constructor(private http: Http) { }

  getDevices(): Promise<Object[]> {

    // get the list of devices
    return this.http.get("/devices")
               .toPromise()
               .then(response => response.json() as Object[])
               .catch(reason => {
                 console.error("Unable to get devices");
                 return Promise.reject(reason.message || reason);
               });
  }
}
