import { Component, Input, OnInit } from "@angular/core";
import { SoftphoneService } from "./softphone.service";
import { AgentStatus } from "./softphone.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-softphone-cmp",
  templateUrl: "./softphone.component.html",
  styleUrls: ["./softphone.component.scss"],
})
export class SoftphoneComponent implements OnInit {
  @Input()
  isOpen = false;

  status: AgentStatus = { status: "", subStatus: "" };

  constructor(
    private softphoneService: SoftphoneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.softphoneService.getAgentStatus().subscribe((status) => {
      this.status = status;
    });
    this.initEventListener();
  }

  getDisplayAgentStatus(status: AgentStatus) {
    return status.status + (status.subStatus ? ` - ${status.subStatus}` : "");
  }

  handleScreenPop(message) {
    this.isOpen = true;
    this.router.navigate(["/customer/member", { memberId: 103 }]);
  }

  handleUserActionSubscription(message) {
    if (message.data.category == "status") {
      this.softphoneService.setAgentStatus({
        status: message.data.data.status,
        subStatus: message.data.data.sub_status,
      });
    }
  }

  handleInteractionSubscription(message) {
    if (["connect", "disconnect"].includes(message.data.category)) {
      this.softphoneService.setInteractionStatus({
        state: message.data.interaction.state,
        interaction: message.data.interaction,
      });
    }
  }

  initEventListener() {
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://apps.mypurecloud.jp") {
        return;
      }
      var message = JSON.parse(event.data);
      console.log(message);
      if (message) {
        if (message.type == "screenPop") {
          this.handleScreenPop(message);
        } else if (message.type == "userActionSubscription") {
          this.handleUserActionSubscription(message);
        } else if (message.type == "interactionSubscription") {
          this.handleInteractionSubscription(message);
        }
        // if(message.type == "screenPop"){
        //     document.getElementById("screenPopPayload").value = event.data;
        // } else if(message.type == "processCallLog"){
        //     document.getElementById("processCallLogPayLoad").value = event.data;
        // } else if(message.type == "openCallLog"){
        //     document.getElementById("openCallLogPayLoad").value = event.data;
        // } else if(message.type == "interactionSubscription"){
        //     document.getElementById("interactionSubscriptionPayload").value = event.data;
        // } else if(message.type == "userActionSubscription"){
        //     document.getElementById("userActionSubscriptionPayload").value = event.data;
        // } else if(message.type == "notificationSubscription"){
        //     document.getElementById("notificationSubscriptionPayload").value = event.data;
        // } else if(message.type == "contactSearch") {
        //     document.getElementById("searchText").innerHTML = ": " + message.data.searchString;
        //     sendContactSearch();
        // }
      }
    });
  }
}

/*

Example of message from PureCloud:
{
    "type": "screenPop",
    "data": {
        "searchString": "+66819994972",
        "interactionId": {
            "id": "cd66ba23-5490-4510-8f9e-d67393d44feb",
            "phone": "tel:+66819994972",
            "name": "0819994972",
            "isConnected": false,
            "isDisconnected": false,
            "isDone": false,
            "state": "ALERTING",
            "isCallback": false,
            "isDialer": false,
            "isChat": false,
            "isEmail": false,
            "isMessage": false,
            "isVoicemail": false,
            "remoteName": "0819994972",
            "recordingState": "paused",
            "securePause": false,
            "displayAddress": "+66819994972",
            "queueName": "10-ACC",
            "ani": "+66819994972",
            "calledNumber": "+6624300023",
            "totalIvrDurationSeconds": 2,
            "direction": "Inbound",
            "isInternal": false
        }
    }
}

{
    "type": "interactionSubscription",
    "data": {
        "category": "add",
        "interaction": {
            "id": "cd66ba23-5490-4510-8f9e-d67393d44feb",
            "phone": "tel:+66819994972",
            "name": "0819994972",
            "isConnected": false,
            "isDisconnected": false,
            "isDone": false,
            "state": "ALERTING",
            "isCallback": false,
            "isDialer": false,
            "isChat": false,
            "isEmail": false,
            "isMessage": false,
            "isVoicemail": false,
            "remoteName": "0819994972",
            "recordingState": "paused",
            "securePause": false,
            "displayAddress": "+66819994972",
            "queueName": "10-ACC",
            "ani": "+66819994972",
            "calledNumber": "+6624300023",
            "totalIvrDurationSeconds": 2,
            "direction": "Inbound",
            "isInternal": false
        }
    }
}

{
  "type": "interactionSubscription",
  "data": {
      "category": "connect",
      "interaction": {
          "id": "d79419ab-91e8-4feb-ab98-58fe4b1127dd",
          "connectedTime": "2024-06-21T04:08:39.708Z",
          "phone": "tel:+66819994972",
          "name": "0819994972",
          "isConnected": true,
          "isDisconnected": false,
          "isDone": false,
          "state": "CONNECTED",
          "isCallback": false,
          "isDialer": false,
          "isChat": false,
          "isEmail": false,
          "isMessage": false,
          "isVoicemail": false,
          "remoteName": "0819994972",
          "recordingState": "active",
          "securePause": false,
          "displayAddress": "+66819994972",
          "queueName": "1-CX-DEMO",
          "ani": "+66819994972",
          "calledNumber": "+6624300023",
          "totalIvrDurationSeconds": 3,
          "direction": "Inbound",
          "isInternal": false,
          "startTime": "2024-06-21T04:08:26.092Z"
      }
  }
}

{
  "type": "interactionSubscription",
  "data": {
      "category": "disconnect",
      "interaction": {
          "id": "d79419ab-91e8-4feb-ab98-58fe4b1127dd",
          "connectedTime": "2024-06-21T04:08:39.708Z",
          "endTime": "2024-06-21T04:08:43.413Z",
          "phone": "tel:+66819994972",
          "name": "0819994972",
          "isConnected": false,
          "isDisconnected": true,
          "isDone": false,
          "state": "DISCONNECTED",
          "isCallback": false,
          "isDialer": false,
          "isChat": false,
          "isEmail": false,
          "isMessage": false,
          "isVoicemail": false,
          "remoteName": "0819994972",
          "recordingState": "none",
          "securePause": false,
          "displayAddress": "+66819994972",
          "queueName": "1-CX-DEMO",
          "ani": "+66819994972",
          "calledNumber": "+6624300023",
          "interactionDurationSeconds": 4,
          "totalIvrDurationSeconds": 3,
          "totalAcdDurationSeconds": 11,
          "direction": "Inbound",
          "isInternal": false,
          "startTime": "2024-06-21T04:08:26.092Z"
      }
  }
}

*/
