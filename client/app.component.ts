import { Component } from "@angular/core";

@Component({
  selector: "my-app",
  // even though this is in the same folder in version control, we need the
  // relative path at runtime, which is in the app folder.
  templateUrl: "./app/app.component.html"
})

export class AppComponent { }
