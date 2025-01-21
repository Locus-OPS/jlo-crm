import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { MatDialog } from '@angular/material/dialog';
import { BroadcastComponent } from './broadcast/broadcast.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent extends BaseComponent implements OnInit {

  chatList: any[] = [];
  users: any[] = [];
  chatGroups: any[] = [];
  user: any;
  chatGroup: any;
  searchForm: FormGroup;
  messagetype: string = '';

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
    public chatService: ChatService,
    public dialog: MatDialog,
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
    if (this.room.toString().trim()) {
      this.chatService.sendMessage(`/join ${this.room}`);
    }
  }

  sendMessagetoChatRoom(): void {
    if (this.newMessage.trim()) {
      let msg = '[From ' + this.globals.profile.id + ']: ' + this.newMessage;
      this.messages.push(msg);
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  sendPrivateMessage(): void {
    if (this.recipient.trim() && this.newMessage.trim()) {
      let msg = '[Private from ' + this.globals.profile.id + ']: ' + this.newMessage;
      this.messages.push(msg);
      //console.log(msg);
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

  getChatList() {
    this.chatService.getChatList({ data: { chatName: this.searchForm.get('userChatName').value }, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.chatList = res.data;
      }
    });
  }

  getUserList() {
    const param = this.searchForm.getRawValue();
    this.chatService.getUserList({ data: param, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
        //console.log(res.data);
      }
    });
  }

  getChatGroupList() {
    this.users = [];
    this.chatGroups = [];
    this.chatService.getChatRoomList({ data: {}, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.chatGroups = res.data;
      }
    });
  }

  getChatMessageList() {

  }

  onSelectUser(user: any) {
    // alert(JSON.stringify(user));
    this.messagetype = 'private';
    this.messages = [];
    this.user = user;
    this.recipient = user.id.toString();
    this.loadChatHistory();
  }

  onSelectGroup(group: any) {
    this.messages = [];
    this.messagetype = 'public';
    this.chatGroup = group;
    this.room = group.roomId;
    this.loadChatGroupHistory();
    this.joinRoom();
  }

  onScroll(event: any): void {
    //console.log(event.target);
  }

  parseMessage(input) {
    //.log(input);
    if (input == null) return;
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

  parseMessageChatGroup(input) {
    // console.log(input);
    const regex = /^\[From ([^:]+)\]:\s(.+)$/;
    const match = input.match(regex);
    // console.log(match);
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

  isUserMatchChatRoom(message: any): boolean {
    if (message == null) return;
    const parsedUser = this.parseMessageChatGroup(message).user.toString();
    const profileUserId = '' + this.globals.profile.id.toString();
    // console.log(parsedUser + "=>" + profileUserId + " " + (parsedUser === profileUserId));
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

          //console.log(res.data);
        }
        console.log("Error");
      });
    }
  }

  loadChatGroupHistory() {
    this.chatService.getPublicChatMessages({ data: { roomId: this.chatGroup.roomId }, pageNo: 0, pageSize: 50 }).then((res) => {
      if (res.status) {
        let chatMsg = res.data.reverse();
        for (let i = 0; i < chatMsg.length; i++) {
          let msg = chatMsg[i].messageText;
          let sender = chatMsg[i].senderId;
          msg = '[From ' + sender + ']: ' + msg;
          this.messages.push(msg);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.chatService.disconnect();
  }


  setActiveTab(tabName: string): void {
    this.user = null;
    this.chatGroup = null;
    this.activeTab = tabName; // ตั้งค่าแท็บที่ถูกเลือก
    // console.log('Active Tab:', this.activeTab);
    if (tabName === 'AllUsers') {
      this.messagetype = 'private';
      this.getUserList();
    } else if (tabName === 'Chat') {
      this.getChatList();
    } else if (tabName === 'Group') {
      this.messagetype = 'public';
      this.getChatGroupList();
    }
  }

  onSelectChat(chat: any) {
    this.messages = [];
    this.user = chat;
    if (chat.messageType == 'private') {
      this.messagetype = 'private';
      this.recipient = chat.id.toString();
      this.loadChatHistory();
    }
  }

  openChatGroupModal() {
    const dialogRef = this.dialog.open(ChatGroupComponent, {
      height: '50%',
      width: '30%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getChatGroupList();
      }
    });
  }

  openBroadCastModal() {
    const dialogRef = this.dialog.open(BroadcastComponent, {
      height: '50%',
      width: '30%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
