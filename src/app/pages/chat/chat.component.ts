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
  user: any;
  searchForm: FormGroup;

  username: string = '';
  room: string = 'general';
  messages: string[] = [];
  newMessage: string = '';
  recipient: string = ''; // สำหรับการแชท 1:1
  private subscription: Subscription | null = null;

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
    const userId = this.globals.profile.userId;
    if (userId.trim()) {
      // alert(userId);
      this.chatService.connect(userId);
    } else {
      alert('Please enter your username!');
    }

    console.log("connected");
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
      let msg = '[Private from ' + this.globals.profile.userId + ']: ' + this.newMessage;
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

  onSelectUser(user: any) {
    this.messages = [];
    this.user = user;
    this.recipient = user.userId;
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
    const profileUserId = '' + this.globals.profile.userId;
    return parsedUser === profileUserId;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.chatService.disconnect();
  }

}
