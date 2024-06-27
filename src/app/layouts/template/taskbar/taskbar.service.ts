import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TaskbarEvent } from "./taskbar.model";

@Injectable({
  providedIn: 'root'
})
export class TaskbarService {

  private taskbarEventSubject = new BehaviorSubject<TaskbarEvent>({ type: '', action: '' });

  getTaskbarEvent() {
    return this.taskbarEventSubject.asObservable();
  }

  setTaskbarEvent(event: TaskbarEvent) {
    this.taskbarEventSubject.next(event);
  }

}
