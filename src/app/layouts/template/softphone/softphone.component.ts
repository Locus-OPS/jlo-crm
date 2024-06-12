import { Component, OnInit } from "@angular/core";
import { SoftphoneService } from "./softphone.service";
import { AgentStatus } from "./softphone.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-softphone-cmp",
  templateUrl: "./softphone.component.html",
  styleUrls: ["./softphone.component.scss"],
})
export class SoftphoneComponent implements OnInit {
  isOpen = false;
  status: AgentStatus = { status: "", subStatus: "" };

  constructor(private softphoneService: SoftphoneService, private router: Router) {}

  ngOnInit(): void {
    this.softphoneService.getAgentStatus().subscribe((status) => {
      this.status = status;
    });
    this.initEventListener();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  getDisplayAgentStatus(status: AgentStatus) {
    return status.status + (status.subStatus ? ` - ${status.subStatus}` : "");
  }

  handleUserActionSubscription(message) {
    if (message.data.category == "status") {
      this.softphoneService.setAgentStatus({
        status: message.data.data.status,
        subStatus: message.data.data.sub_status,
      });
    }
  }

  handleScreenPop(message) {
    this.isOpen = true;
    this.router.navigate(["/customer/member", { memberId: 103 }]);
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
        }
        else if (message.type == "userActionSubscription") {
          this.handleUserActionSubscription(message);
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
    "type": "notificationSubscription",
    "data": {
        "category": "interactionSelection",
        "data": {
            "interactionId": "cd66ba23-5490-4510-8f9e-d67393d44feb"
        }
    }
}

*/
