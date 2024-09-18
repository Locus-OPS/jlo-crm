import { Component, OnInit } from "@angular/core";
import { SoftphoneService } from "./softphone/softphone.service";
import { TaskbarService } from "./taskbar.service";
import { SharedModule } from "src/app/shared/module/shared.module";
import { SoftphoneComponent } from "./softphone/softphone.component";
import { TaskQueueComponent } from "./task-queue/task-queue.component";

@Component({
  selector: "app-taskbar-cmp",
  templateUrl: "./taskbar.component.html",
  styleUrls: ["./taskbar.component.scss"],
  standalone: true,
  imports: [SharedModule, SoftphoneComponent, TaskQueueComponent]
})
export class TaskbarComponent implements OnInit {

  isSoftphoneOpen = false;
  isTaskQueueOpen = false;

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
            this.isTaskQueueOpen = false;
            this.isSoftphoneOpen = true;
            break;
        }
      } else if (event.type === "task-queue") {
        switch (event.action) {
          case "close":
            this.isTaskQueueOpen = false;
            break;
          case "open":
            this.isSoftphoneOpen = false;
            this.isTaskQueueOpen = true;
            break;
        }
      }
    });
  }

  toggleSoftphone() {
    this.isTaskQueueOpen = false;
    this.isSoftphoneOpen = !this.isSoftphoneOpen;
  }

  toggleTaskQueue() {
    this.isSoftphoneOpen = false;
    this.isTaskQueueOpen = !this.isTaskQueueOpen;
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
