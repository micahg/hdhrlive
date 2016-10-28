import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { HDHRService } from "./hdhr.service";

@NgModule({
  imports: [ HttpModule, BrowserModule ],
  declarations: [ AppComponent ],
  providers: [ HDHRService],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
