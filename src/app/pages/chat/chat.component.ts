import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent extends BaseComponent implements OnInit {

  users: any[] = [];
  groups: any[] = [];
  user: any;
  group: any;
  searchForm: FormGroup;

  username: string = '';
  room: string = 'general';
  messages: string[] = [];
  newMessage: string = '';
  recipient: string = ''; // สำหรับการแชท 1:1
  private subscription: Subscription | null = null;

  //Tab สำหรับการ Chat
  activeTab: string = 'AllUsers'; // ค่าเริ่มต้นของแท็บที่ active

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public chatService: ChatService
  ) {
    super(router, globals);
    this.connect();
  }

  ngOnInit(): void {
    this.initForm();
    this.getUserList();
    this.subscription = this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

  }

  connect(): void {
    const userId = this.globals.profile.id.toString();
    if (userId.trim()) {
      this.chatService.connect(userId);
    } else {
      alert('Please enter your username!');
    }
  }

  joinRoom(): void {
    if (this.room.trim()) {
      this.chatService.sendMessage(`/join ${this.room}`);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  sendPrivateMessage(): void {
    if (this.recipient.trim() && this.newMessage.trim()) {
      let msg = '[Private from ' + this.globals.profile.id + ']: ' + this.newMessage;
      this.messages.push(msg);
      console.log(msg);
      this.chatService.sendMessage(`/private ${this.recipient} ${this.newMessage}`);
      this.newMessage = '';

    } else {
      alert('Please provide a recipient and a message.');
    }
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      userChatName: ['']
    });
  }

  disconnect(): void {
    this.chatService.disconnect();
  }

  getUserList() {
    const param = this.searchForm.getRawValue();
    this.chatService.getUserList({ data: param, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
        console.log(res.data);
      }
      console.log("Error");
    });
  }

  getChatGroupList() {
    this.users = [];
    this.groups = [];
    this.chatService.getChatRoomList({ data: {}, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.groups = res.data;
        console.log(res.data);
      }
      console.log("Error");
    });
  }

  getChatMessageList() {

  }

  onSelectUser(user: any) {
    // alert(JSON.stringify(user));
    this.messages = [];
    this.user = user;
    this.recipient = user.id.toString();
    this.loadChatHistory();
  }

  onScroll(event: any): void {
    console.log(event.target);
  }

  parseMessage(input) {
    console.log(input);
    const regex = /^\[Private from ([^:]+)\]:\s(.+)$/;
    const match = input.match(regex);
    console.log(match);
    if (match) {
      const user = match[1];
      const message = match[2];
      return { user, message };
    } else {
      throw new Error("Invalid format");
    }
  }

  isUserMatch(message: any): boolean {
    const parsedUser = this.parseMessage(message).user;
    const profileUserId = '' + this.globals.profile.id.toString();
    return parsedUser === profileUserId;
  }

  loadChatHistory() {
    if (this.user != null) {
      this.chatService.getPrivateChatMessages({ data: { senderId: this.globals.profile.id, targetId: this.user.id }, pageNo: 0, pageSize: 50 }).then((res) => {
        if (res.status) {
          let chatMsg = res.data.reverse();
          for (let i = 0; i < chatMsg.length; i++) {
            let msg = chatMsg[i].messageText;
            let sender = chatMsg[i].senderId;
            if (sender == this.globals.profile.id) {
              msg = '[Private from ' + this.globals.profile.id + ']: ' + msg;
            } else {
              msg = '[Private from ' + this.user.targetId + ']: ' + msg;
            }
            this.messages.push(msg);
          }

          console.log(res.data);
        }
        console.log("Error");
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.chatService.disconnect();
  }


  setActiveTab(tabName: string): void {
    this.user = null;
    this.activeTab = tabName; // ตั้งค่าแท็บที่ถูกเลือก
    console.log('Active Tab:', this.activeTab);
    if (tabName === 'AllUsers') {
      this.getUserList();
    } else if (tabName === 'Chat') {
      //this.getChatGroupList();
    } else if (tabName === 'Group') {
      this.getChatGroupList();
    }
  }

}
