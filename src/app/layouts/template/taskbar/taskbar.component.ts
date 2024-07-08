import { Component, OnInit } from "@angular/core";
import { SoftphoneService } from "./softphone/softphone.service";
import { TaskbarService } from "./taskbar.service";
import { SharedModule } from "src/app/shared/module/shared.module";
import { SoftphoneComponent } from "./softphone/softphone.component";

@Component({
  selector: "app-taskbar-cmp",
  templateUrl: "./taskbar.component.html",
  styleUrls: ["./taskbar.component.scss"],
  standalone: true,
  imports: [SharedModule, SoftphoneComponent]
})
export class TaskbarComponent implements OnInit {

  isSoftphoneOpen = false;

  constructor(
    private softphoneService: SoftphoneService,
    private taskbarService: TaskbarService
  ) { }

  ngOnInit(): void {
    this.taskbarService.getTaskbarEvent().subscribe((event) => {
      if (event.type === "phone") {
        switch (event.action) {
          case "close":
            this.isSoftphoneOpen = false;
            break;
          case "open":
            this.isSoftphoneOpen = true;
            break;
        }
      }
    });
  }

  toggleSoftphone() {
    this.isSoftphoneOpen = !this.isSoftphoneOpen;
  }

  pickup() {
    this.softphoneService.pickup();
  }

  disconnect() {
    this.softphoneService.disconnect();
  }

  hold() {
    this.softphoneService.hold();
  }

  mute() {
    this.softphoneService.mute();
  }

}
