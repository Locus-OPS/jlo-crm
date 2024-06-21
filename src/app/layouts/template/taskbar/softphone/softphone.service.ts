import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs-compat";
import { AgentStatus, InteractionStatus } from "./softphone.model";

@Injectable({
  providedIn: 'root'
})
export class SoftphoneService {

  private agentStatusSubject = new BehaviorSubject<AgentStatus>(null);
  private interactionStatusSubject = new BehaviorSubject<InteractionStatus>(null);

  getAgentStatus(): Observable<AgentStatus> {
    return this.agentStatusSubject.asObservable();
  }

  setAgentStatus(status: AgentStatus) {
    this.agentStatusSubject.next(status);
  }

  getInteractionStatus(): Observable<InteractionStatus> {
    return this.interactionStatusSubject.asObservable();
  }

  setInteractionStatus(status: InteractionStatus) {
    this.interactionStatusSubject.next(status);
  }

}
