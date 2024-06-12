import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs-compat";
import { AgentStatus } from "./softphone.model";

@Injectable({
  providedIn: 'root'
})
export class SoftphoneService {

  private agentStatusSubject = new BehaviorSubject<AgentStatus>(null);

  getAgentStatus(): Observable<AgentStatus> {
    return this.agentStatusSubject.asObservable();
  }

  setAgentStatus(status: AgentStatus) {
    this.agentStatusSubject.next(status);
  }

}
