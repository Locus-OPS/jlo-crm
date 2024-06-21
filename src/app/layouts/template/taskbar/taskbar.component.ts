import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-taskbar-cmp",
  templateUrl: "./taskbar.component.html",
  styleUrls: ["./taskbar.component.scss"],
})
export class TaskbarComponent implements OnInit {

  isSoftphoneOpen = false;

  constructor() {}

  ngOnInit(): void {
  }

  toggleSoftphone() {
    this.isSoftphoneOpen = !this.isSoftphoneOpen;
  }
}
