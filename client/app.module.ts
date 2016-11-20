import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
// import { DeviceModal } from "./device.modal";
import { HDHRService } from "./hdhr.service";

@NgModule({
  imports: [ HttpModule, BrowserModule, NgbModule.forRoot() ],
  declarations: [ AppComponent ],
  providers: [ HDHRService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
