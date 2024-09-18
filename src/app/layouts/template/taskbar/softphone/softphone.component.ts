import { Component, Input, OnInit } from "@angular/core";
import { SoftphoneService } from "./softphone.service";
import { AgentStatus } from "./softphone.model";
import { Router } from "@angular/router";
import Utils from "src/app/shared/utils";
import { CustomerService } from "src/app/pages/customer/customer.service";
import { ConsultingInfoService } from "../../consulting-info/consulting-info.service";
import { MatDialog } from "@angular/material/dialog";
import { TaskbarService } from "../taskbar.service";
import { SharedModule } from "src/app/shared/module/shared.module";

@Component({
  selector: "app-softphone-cmp",
  templateUrl: "./softphone.component.html",
  styleUrls: ["./softphone.component.scss"],
  standalone: true,
  imports: [SharedModule]
})
export class SoftphoneComponent implements OnInit {
  @Input()
  isOpen = false;

  status: AgentStatus = { status: "", subStatus: "" };
  customerId: string;

  constructor(
    private customerService: CustomerService,
    private softphoneService: SoftphoneService,
    private router: Router,
    private consultingInfoService: ConsultingInfoService,
    public dialog: MatDialog,
    private taskbarService: TaskbarService
  ) { }

  ngOnInit(): void {
    this.initEventListener();
    this.initSendEvent();

    this.softphoneService.getAgentStatus().subscribe((status) => {
      this.status = status;
    });

    this.softphoneService.getInteractionStatus().subscribe(msg => {
      if (msg != null && msg != undefined) {
        console.log("msg.state : " + msg.state);
        if (msg.state == "CONNECTED") {
          // Insert Consulting
          this.consultingInfoService.onStartPhoneConsulting(this.customerId);
        } else if (msg.state == "DISCONNECTED") {
          this.consultingInfoService.onStopConsulting();
        }
        console.log("msg.interaction : " + msg.interaction);
      }

      // TODO Check message.data.interaction.state == 'CONNECTED'
      /**
       * if(CONNECTED)
       * 1. Insert consulting
       * 2. open modal consulting
       *
       */
    });
  }

  getDisplayAgentStatus(status: AgentStatus) {
    return status.status + (status.subStatus ? ` - ${status.subStatus}` : "");
  }

  close() {
    this.taskbarService.setTaskbarEvent({ type: "phone", action: "close" });
  }

  /**
   *
   * @param message
   */
  handleScreenPop(message) {
    this.isOpen = true;
    // TODO Call Customer service search by phone no
    console.log("Begin handleScreenPop");
    console.log(message);
    console.log("End handleScreenPop");
    if (message.data.interactionId.ani != null && message.data.interactionId.ani != undefined) {
      let ani = message.data.interactionId.ani;
      let phoneNo = Utils.replaceThCodePhoneNo(ani);
      console.log("ANI PHONE NO :" + phoneNo);
      this.getCustomerByPhoneNo(phoneNo);
    } else {
      this.router.navigate(["/customer"]);
    }

    //this.router.navigate(["/customer/member", { memberId: 103 }]);

  }


  /**
   * 1.เจอ คนเดียวจังๆ ให้ไปหน้า customer detail / member detail
      2.เจอหลายคน ให้มาที่หน้า customer list
      3 ถ้าไม่เจอ ให้มาที่หน้า customer list
    * @param phoneNo
    */
  getCustomerByPhoneNo(phoneNo: string) {
    const param = {
      phoneNo: phoneNo
    };
    this.customerService.getCustomerByPhoneNo({
      data: param
    }).then(result => {
      if (result.status) {

        if (result.data.length == 0 || result.data.length > 1) {
          this.router.navigate(["/customer"]);
        } else {
          this.customerId = result.data[0].customerId;
          this.gotoMemberCustomerPage(result.data[0].isMemberFlag, result.data[0].memberId, this.customerId, result.data[0].phoneNo);

        }
      } else {
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }
  /**
   *
   * @param isMemberFlag
   * @param memberId
   * @param customerId
   */
  gotoMemberCustomerPage(isMemberFlag: boolean, memberId: string, customerId: string, phoneNo: string) {
    if (isMemberFlag) {
      this.router.navigate([
        "/customer/member", { memberId: memberId, phoneNo: phoneNo },
      ]);
    } else {

      this.router.navigate([
        "/customer/customer", { customerId: customerId, phoneNo: phoneNo },
      ]);

      // Phone TEST
      // this.consultingInfoService.onStartPhoneConsulting(this.customerId);
    }
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
    this.softphoneService.setInteractionStatus({
      state: message.data.interaction.state,
      interaction: message.data.interaction,
    });
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

  initSendEvent() {
    this.softphoneService.getSendAgentStatus().subscribe((status) => {
      if (status) {
        this.updateUserStatus(status.status);
      }

    });
    this.softphoneService.getSendInteractionStatus().subscribe((state) => {
      if (state) {
        this.updateInteractionState(state);
      }
    });
  }

  updateUserStatus(status: string) {
    const iframe = document.getElementById('embedded-softphone') as HTMLIFrameElement;
    iframe.contentWindow.postMessage(JSON.stringify({
      type: 'updateUserStatus',
      data: { id: status }
    }), "*");
  }

  updateInteractionState(state: string) {
    const lastInteraction = this.softphoneService.getLastInteraction();
    var interactionId;
    if (lastInteraction.old) {
      interactionId = lastInteraction.old.id;
    } else {
      interactionId = lastInteraction.id;
    }
    const iframe = document.getElementById('embedded-softphone') as HTMLIFrameElement;
    iframe.contentWindow.postMessage(JSON.stringify({
      type: 'updateInteractionState',
      data: {
        action: state,
        id: interactionId
      }
    }), "*");
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

{
    "type": "interactionSubscription",
    "data": {
        "category": "acw",
        "interaction": {
            "id": "29e82a01-8e07-44a9-8e54-6647131663cc",
            "connectedTime": "2024-06-25T10:02:12.367Z",
            "endTime": "2024-06-25T10:02:18.268Z",
            "phone": "tel:+66819994972",
            "name": "0819994972",
            "isConnected": false,
            "isDisconnected": true,
            "isDone": true,
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
            "interactionDurationSeconds": 6,
            "totalIvrDurationSeconds": 3,
            "totalAcdDurationSeconds": 3,
            "disposition": "Default Wrap-up Code",
            "dispositionDurationSeconds": 17,
            "direction": "Inbound",
            "isInternal": false,
            "startTime": "2024-06-25T10:02:05.620Z"
        }
    }
}

*/
