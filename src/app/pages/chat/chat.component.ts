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
  imports: [SharedModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent extends BaseComponent implements OnInit {

  private styleCache = new Map<string, string>();

  chatList: any[] = [];
  users: any[] = [];
  chatGroups: any[] = [];
  user: any;
  chatGroup: any;
  searchForm: FormGroup;
  messagetype: string = '';

  username: string = '';
  room: string = 'general';
  messages: any[] = [];
  newMessage: string = '';
  recipient: string = ''; // สำหรับการแชท 1:1
  private subscription: Subscription | null = null;

  //Tab สำหรับการ Chat
  activeTab: string = 'AllUsers'; // ค่าเริ่มต้นของแท็บที่ active

  //Attribute สำหรับการ Chat
  msgPageNo: number = 0;
  msgpageSize: number = 50;
  lastMessageId: number = 0;
  totalMessages: number = 0;

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
      console.log(message);
      this.messages.push(JSON.parse(message));
    });

  }

  connect(): void {
    const userId = this.globals.profile.id.toString();
    if (userId.trim()) {
      this.chatService.connect(userId);
    } else {
      alert('กรุณากรอกชื่อผู้ใช้!');
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
      // this.messages.push(msg);
      let msgObj = { senderId: this.globals.profile.id, roomId: this.room, messageText: this.newMessage, createdAt: this.formatCurrentDate() };
      this.messages.push(msgObj);
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  sendPrivateMessage(): void {
    if (this.recipient.trim() && this.newMessage.trim()) {
      let msg = '[Private from ' + this.globals.profile.id + ']: ' + this.newMessage;
      let msgObj = { senderId: this.globals.profile.id, targetId: this.recipient, messageText: this.newMessage, createdAt: this.formatCurrentDate() };
      this.messages.push(msgObj);
      this.chatService.sendMessage(`/private ${this.recipient} ${this.newMessage}`);
      this.newMessage = '';

    } else {
      alert('กรุณาระบุผู้รับและข้อความ');
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

  searchData() {
    if (this.activeTab === 'AllUsers') {
      this.getUserList();
    } else if (this.activeTab === 'Chat') {
      this.getChatList();
    } else if (this.activeTab === 'Group') {
      this.getChatGroupList();
    }
  }

  getUserList() {
    const param = this.searchForm.getRawValue();
    this.chatService.getUserList({ data: param, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
      }
    });
  }

  getChatGroupList() {
    this.users = [];
    this.chatGroups = [];
    this.chatService.getChatRoomList({ data: { roomName: this.searchForm.get('userChatName').value }, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.chatGroups = res.data;
      }
    });
  }

  onSelectUser(user: any) {
    this.messagetype = 'private';
    this.messages = [];
    this.user = user;
    this.msgPageNo = 0;
    this.lastMessageId = 0;
    this.recipient = user.id.toString();
    this.loadChatHistory();

  }

  onSelectGroup(group: any) {
    this.messages = [];
    this.messagetype = 'public';
    this.chatGroup = group;
    this.room = group.roomId;
    this.msgPageNo = 0;
    this.lastMessageId = 0;
    this.loadChatGroupHistory();
    this.joinRoom();
  }

  isUserMatch(message: any): boolean {
    if (message == null) return;
    const parsedUser = message.senderId.toString();
    const profileUserId = '' + this.globals.profile.id.toString();
    return parsedUser === profileUserId;
  }

  isUserMatchChatRoom(message: any): boolean {
    if (message == null) return;
    const parsedUser = message.senderId.toString();
    const profileUserId = '' + this.globals.profile.id.toString();
    return parsedUser === profileUserId;
  }

  loadChatHistory() {
    if (this.user != null) {

      this.chatService.getPrivateChatMessages({ data: { senderId: this.globals.profile.id, lastMessageId: this.lastMessageId, targetId: this.user.id }, pageNo: this.msgPageNo, pageSize: this.msgpageSize }).then((res) => {
        if (res.status) {

          //Click ครั้งแรก?
          if (this.lastMessageId == 0) {
            this.totalMessages = res.total;
          }

          if (res.data.length > 0) {
            this.lastMessageId = res.data[res.data.length - 1].messageId;
            // console.log("Last Message : " + this.lastMessageId);
          }
          let chatMsg = res.data.reverse();
          if (this.messages.length > 0) {

            let tempMsg = this.messages;
            this.messages = [];
            chatMsg.forEach((msg) => {
              this.messages.push(msg);
            });
            tempMsg.forEach((msg) => {
              this.messages.push(msg);
            });

          } else {
            chatMsg.forEach((msg) => {
              this.messages.push(msg);
            });
          }
        }

      }).finally(() => {
        // icon.classList.remove('spin');
      });
    }
  }

  loadChatGroupHistory() {
    this.chatService.getPublicChatMessages({ data: { roomId: this.chatGroup.roomId, lastMessageId: this.lastMessageId }, pageNo: this.msgPageNo, pageSize: this.msgpageSize }).then((res) => {
      if (res.status) {
        //Click ครั้งแรก?
        if (this.lastMessageId == 0) {
          this.totalMessages = res.total;
        }
        if (res.data.length > 0) {
          this.lastMessageId = res.data[res.data.length - 1].messageId;
        }
        let chatMsg = res.data.reverse();
        if (this.messages.length > 0) {

          let tempMsg = this.messages;
          this.messages = [];
          chatMsg.forEach((msg) => {
            this.messages.push(msg);
          });
          tempMsg.forEach((msg) => {
            this.messages.push(msg);
          });

        } else {
          chatMsg.forEach((msg) => {
            this.messages.push(msg);
          });
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
    this.msgPageNo = 0;
    if (tabName === 'AllUsers') {
      this.msgPageNo = 0;
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
    this.msgPageNo = 0;
    this.totalMessages = 0;
    this.lastMessageId = 0;
    if (chat.messageType == 'private') {
      this.messagetype = 'private';
      this.recipient = chat.id.toString();
      this.loadChatHistory();
    } else if (chat.messageType == 'public') {
      this.messagetype = 'public';
      this.chatGroup = { roomId: chat.id, roomName: chat.chatName };
      this.room = chat.id;
      this.loadChatGroupHistory();
      this.joinRoom();
    }
  }

  openChatGroupModal() {
    const dialogRef = this.dialog.open(ChatGroupComponent, {
      height: '70%',
      width: '50%',
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
      height: '70%',
      width: '50%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.getChatList();
        }, 2000);
      }
    });
  }

  formatCurrentDate() {
    const now = new Date();

    // ดึงข้อมูลแต่ละส่วนของวันที่
    const day = String(now.getDate()).padStart(2, '0'); // วันที่ (เติม 0 ข้างหน้า)
    const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือน (เริ่มต้นที่ 0)
    const year = now.getFullYear(); // ปี
    const hours = String(now.getHours()).padStart(2, '0'); // ชั่วโมง
    const minutes = String(now.getMinutes()).padStart(2, '0'); // นาที
    const seconds = String(now.getSeconds()).padStart(2, '0'); // วินาที

    // รวมวันที่เป็นฟอร์แมตที่กำหนด
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  editChatRoom() {
    if (this.chatGroup != null) {
      const dialogRef = this.dialog.open(ChatGroupComponent, {
        height: '70%',
        width: '50%',
        panelClass: 'my-dialog',
        data: { roomId: this.chatGroup.roomId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'edit') {
          setTimeout(() => {
            this.getChatGroupList();
          }, 2000);
        } else if (result === 'delete') {
          this.chatGroup = null;
          this.getChatGroupList();
        }
      });
    }
  }

  getBackgroundStyle(pictureUrl: string): { [key: string]: string } {
    const cacheKey = pictureUrl || 'default';
    if (!this.styleCache.has(cacheKey)) {
      const url = !pictureUrl || pictureUrl === ''
        ? './assets/img/chat-user-default.png'
        : this.api.getProfileImagePath(pictureUrl);
      this.styleCache.set(cacheKey, `url(${url})`);
    }
    return { 'background-image': this.styleCache.get(cacheKey) };
  }

  getStaticBackgroundStyle(url: string): { [key: string]: string } {
    return { 'background-image': `url(${url})` };
  }

}
