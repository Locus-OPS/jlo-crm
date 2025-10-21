import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TaskbarService } from "../taskbar.service";
import { SharedModule } from "src/app/shared/module/shared.module";
import { Task } from "./task-queue.model";
import { Router } from "@angular/router";
import { CdTimerModule } from 'angular-cd-timer';
import { TaskQueueService } from "./task-queue.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ChatService } from "src/app/pages/chat/chat.service";
import { BaseComponent } from "src/app/shared/base.component";
import { Globals } from "src/app/shared/globals";
import { Subscription } from "rxjs";

@Component({
  selector: "app-task-queue-cmp",
  templateUrl: "./task-queue.component.html",
  styleUrls: ["./task-queue.component.scss"],
  imports: [SharedModule, CdTimerModule]
})
export class TaskQueueComponent implements OnInit {
  @Input()
  isOpen = false;
  tasks: Task[] = [];
  private subscription: Subscription | null = null;
  room: string = 'interactBroadcast';

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    private taskbarService: TaskbarService,
    private taskQueueService: TaskQueueService,
    private snackBar: MatSnackBar,
    private chatService: ChatService,

  ) {
    //super(router, globals);
    this.connect();
  }

  ngOnInit(): void {
    this.getTaskMessageQueList();
    let subTitle = "";
    this.subscription = this.chatService.getMessages().subscribe((message: string) => {
      try {
        let msg = JSON.parse(message);
        if ((msg.channelType === "LINE" || msg.channelType === "FACEBOOK") && msg.direction === "INBOUND") {
          if (msg.messageType == "TEXT") {
            subTitle = `ข้อความใหม่จาก ${msg.displayName}`;
          } else if (msg.messageType == "IMAGE") {
            subTitle = `รูปภาพใหม่จาก ${msg.displayName}`;
          } else if (msg.messageType == "FILE") {
            subTitle = `ไฟล์ใหม่จาก ${msg.displayName}`;
          } else if (msg.messageType == "AUDIO") {
            subTitle = `เสียงใหม่จาก ${msg.displayName}`;
          } else if (msg.messageType == "VIDEO") {
            subTitle = `วีดีโอใหม่จาก ${msg.displayName}`;
          } else {
            subTitle = `ข้อความใหม่จาก ${msg.displayName}`;
          }
          this.notifyNewMessage(msg.channelType, subTitle);
          this.getTaskMessageQueList();
        }
      } catch (error) {
        console.error("Error parsing message:", message, error);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.chatService.disconnect();
  }

  async connect(): Promise<void> {
    const userId = this.globals.profile.id.toString();
    if (userId.trim()) {
      await this.chatService.connect(userId);
      setTimeout(() => {
        this.joinRoom();
      }, 10000);
    } else {
      console.error('Username is required to connect to WebSocket.');
    }
  }

  disconnect(): void {
    this.chatService.disconnect();
  }

  joinRoom(): void {
    if (this.room.toString().trim()) {
      console.log("Join Room task Queue: ", this.room);
      this.chatService.sendMessage(`/join ${this.room}`);
    }
  }

  notifyNewMessage(sender: string, message?: string) {
    this.snackBar.open(`${sender} ${message}`, 'ดูเลย', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  acceptJob(type: string) {
    if (type === "line") {
      this.router.navigate(['/channel/chat']);
      this.close();
    }
  }

  getTaskMessageQueList() {
    this.taskQueueService.getTaskMessageQueList().then((res) => {
      if (res.status) {
        this.tasks = res.data;
      }
    });
  }
  close() {
    this.taskbarService.setTaskbarEvent({ type: "task-queue", action: "close" });
  }

}
