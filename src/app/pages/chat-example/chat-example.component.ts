import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ChatExampleService } from './chat-example.service';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'app-chat-example',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat-example.component.html',
  styleUrls: ['./chat-example.component.scss']
})
export class ChatExampleComponent extends BaseComponent implements OnInit, OnDestroy {
  username: string = '';
  userId: number = this.globals.profile.id;
  room: string = 'general';
  messages: string[] = [];
  newMessage: string = '';
  recipient: string = ''; // สำหรับการแชท 1:1
  privateMessage: string = ''; // เพิ่ม privateMessage สำหรับการแชทส่วนตัว
  broadcastMessage: string = ''; // สำหรับการ broadcast
  private subscription: Subscription | null = null;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public chatService: ChatExampleService
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    // Subscribe to messages
    this.subscription = this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  connect(): void {
    if (this.username.trim()) {
      this.chatService.connect(this.username);
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
      this.chatService.sendMessage(`/private ${this.recipient} ${this.newMessage}`);
      this.newMessage = '';
    } else {
      alert('Please provide a recipient and a message.');
    }
  }

  sendBroadcastMessage(): void {
    if (this.broadcastMessage.trim()) {
      this.chatService.sendMessage(`/broadcast ${this.broadcastMessage}`);
      this.broadcastMessage = '';
    } else {
      alert('Please enter a broadcast message.');
    }
  }

  disconnect(): void {
    this.chatService.disconnect();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.chatService.disconnect();
  }
}
