import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AgentStatus, Interaction, InteractionStatus } from "./softphone.model";

@Injectable({
  providedIn: 'root'
})
export class SoftphoneService {

  private lastInteraction: Interaction = null;
  private agentStatusSubject = new BehaviorSubject<AgentStatus>(null);
  private interactionStatusSubject = new BehaviorSubject<InteractionStatus>(null);
  private sendAgentStatusSubject = new BehaviorSubject<AgentStatus>(null);
  private sendInteractionStatusSubject = new BehaviorSubject<string>(null);

  getLastInteraction(): Interaction {
    return this.lastInteraction;
  }

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
    this.lastInteraction = status.interaction;
    this.interactionStatusSubject.next(status);
  }

  getSendAgentStatus(): Observable<AgentStatus> {
    return this.sendAgentStatusSubject.asObservable();
  }

  setSendAgentStatus(status: AgentStatus) {
    this.sendAgentStatusSubject.next(status);
  }

  getSendInteractionStatus(): Observable<string> {
    return this.sendInteractionStatusSubject.asObservable();
  }

  setSendInteractionStatus(status: string) {
    this.sendInteractionStatusSubject.next(status);
  }

  //   document.getElementById("softphone").contentWindow.postMessage(JSON.stringify({
  //     type: 'clickToDial',
  //     data: { number: '819994972', autoPlace: true }
  // }), "*");

  pickup() {
    this.setSendInteractionStatus('pickup');
  }

  disconnect() {
    this.setSendInteractionStatus('disconnect');
  }

  hold() {
    this.setSendInteractionStatus('hold');
  }

  mute() {
    this.setSendInteractionStatus('mute');
  }

}
