import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TaskbarService } from "../taskbar.service";
import { SharedModule } from "src/app/shared/module/shared.module";
import { Task } from "./task-queue.model";
import { Router } from "@angular/router";
import { CdTimerModule } from 'angular-cd-timer';

@Component({
  selector: "app-task-queue-cmp",
  templateUrl: "./task-queue.component.html",
  styleUrls: ["./task-queue.component.scss"],
  standalone: true,
  imports: [SharedModule, CdTimerModule]
})
export class TaskQueueComponent implements OnInit {
  @Input()
  isOpen = false;

  tasks: Task[] = [
    { type: "line", title: "Tek", subTitle: "สวัสดีครับ", time: 25 },
    { type: "email", title: "denvit@hotmail.com", subTitle: "รบกวนตรวจสอบข้อมูลหน่อยครับ", time: 120 },
    { type: "facebook", title: "Mark Zuckerberg", subTitle: "Hello", time: 5290 },
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private taskbarService: TaskbarService
  ) { }

  ngOnInit(): void {

  }

  acceptJob(type: string) {
    if (type === "line") {
      this.router.navigate(['/channel/chat']);
      this.close();
    }
  }

  close() {
    this.taskbarService.setTaskbarEvent({ type: "task-queue", action: "close" });
  }

}
