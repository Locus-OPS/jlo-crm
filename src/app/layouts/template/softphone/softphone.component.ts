import { Component, OnInit } from "@angular/core";
import { SoftphoneService } from "./softphone.service";
import { AgentStatus } from "./softphone.model";

@Component({
  selector: "app-softphone-cmp",
  templateUrl: "./softphone.component.html",
  styleUrls: ["./softphone.component.scss"],
})
export class SoftphoneComponent implements OnInit {
  isOpen = false;
  status: AgentStatus = { status: "", subStatus: "" };

  constructor(private softphoneService: SoftphoneService) {}

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

  initEventListener() {
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://apps.mypurecloud.jp") {
        return;
      }
      var message = JSON.parse(event.data);
      console.log(message);
      if (message) {
        if (message.type == "userActionSubscription") {
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
