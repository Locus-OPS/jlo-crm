import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { FacebookmsgService } from '../facebookmsg.service';
import { ChatService } from '../../chat/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fbmessaging',
  imports: [SharedModule],
  templateUrl: './fbmessaging.html',
  styleUrl: './fbmessaging.scss'
})
export class Fbmessaging extends BaseComponent implements OnInit {
  searchForm: FormGroup;
  users: any[] = [];
  selectedUser: any = null;
  newMessage: string = '';
  interactionList: any[] = [];
  pageSize = 10; // จำนวนที่จะแสดงต่อครั้ง
  chatPageSize = 10;
  currentPage = 0;
  chatCurrentPage = 0;
  totalUsers = 0;
  totalInteractions = 0;
  room: string = 'general';
  private subscription: Subscription | null = null;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog,
    public facebookmsgService: FacebookmsgService,
    public chatService: ChatService,
  ) {
    super(router, globals);

  }
  ngOnInit(): void {
    this.initForm();
    this.subscription = this.chatService.getMessages().subscribe((message: string) => {
      try {
        let msg = JSON.parse(message);
        if (msg.channelType === "FACEBOOK") {
          this.interactionList.push(msg);
        }
      } catch (error) {
        console.error("Error parsing message:", message, error);
      }
    });
  }

  ngAfterViewInit(): void {
    this.searchData();
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      displayName: ['']
    });
  }

  searchData() {
    this.getAllFacebookUsers();
  }

  searchDataFromSearchBar() {
    this.currentPage = 0;
    this.users = [];
    this.getAllFacebookUsers();
  }

  getAllFacebookUsers() {
    const param = this.searchForm.getRawValue();
    this.facebookmsgService.getAllFacebookUsers({ data: param, pageNo: this.currentPage, pageSize: this.pageSize }).then((res) => {
      if (res.status) {
        if (this.currentPage == 0) {
          this.users = res.data;
        } else {
          this.users.push(...res.data);
        }
        this.totalUsers = res.total;
      }
    });
  }

  onSelectChat(user: any) {
    this.chatCurrentPage = 0;
    this.selectedUser = user;
    this.interactionList = [];
    this.getInteractionList();
    this.room = user.id;
    this.joinRoom();
  }

  getInteractionList() {
    if (!this.selectedUser) return;
    this.facebookmsgService.getChatInteractionList({ data: { ...this.selectedUser }, pageNo: this.chatCurrentPage, pageSize: this.chatPageSize }).then((res) => {
      if (res.status) {
        this.interactionList = [...res.data.reverse(), ...this.interactionList];
        let uniqueById = [
          ...new Map(this.interactionList.map(item => [item.chatInteractionId, item])).values()
        ].sort((a, b) => a.chatInteractionId - b.chatInteractionId);
        this.interactionList = uniqueById;
        this.totalInteractions = res.total;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage || !this.selectedUser) return;
    this.facebookmsgService.sendMessage({ data: { userId: this.selectedUser.id, messageText: this.newMessage } }).then((res) => {
      if (res.status) {
        this.newMessage = '';
        this.interactionList.push(res.data);
      } else {
        console.error(res.message);
      }
    });
  }

  loadMore() {
    this.currentPage = this.currentPage + 1;
    this.getAllFacebookUsers();
  }

  loadMoreChat() {
    this.chatCurrentPage = this.chatCurrentPage + 1;
    this.getInteractionList();
  }

  joinRoom(): void {
    if (this.room.toString().trim()) {
      this.chatService.sendMessage(`/join FACEBOOK-${this.room}`);
    }
  }

  getAttachmentsHtml(payload: any) {
    try {
      // console.log("getAttamentsHtml payload:", payload);
      if (typeof payload === "string") {
        payload = JSON.parse(payload);

      }
      const attachments = payload.entry[0].messaging[0].message.attachments;
      if (!attachments || attachments.length === 0) {
        return "";
      }
      // สร้าง HTML จากทุก attachment
      let html = "";
      attachments.forEach(att => {
        if (att.payload) {
          const url = att.payload.url || "";
          const type = att.type || "";
          let htmlPart = "";

          switch (type) {
            case "image":
            case "sticker":
              htmlPart = `
          <div class="attachment-item image-item">
            <img src="${url}" alt="${type}" width="150" style="border-radius:10px;">
          </div>
        `;
              break;

            case "audio":
              htmlPart = `
          <div class="attachment-item audio-item">
            <audio controls style="width: 100%;">
              <source src="${url}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        `;
              break;

            case "video":
              htmlPart = `
          <div class="attachment-item video-item">
            <video controls width="250" style="border-radius:10px;">
              <source src="${url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `;
              break;

            case "file":
              htmlPart = `
          <div class="attachment-item file-item">
            <a href="${url}" target="_blank" style="color:#1877F2;">
              📄 ดาวน์โหลดไฟล์
            </a>
          </div>
        `;
              break;

            default:
              htmlPart = ``;
          }

          html += htmlPart;
        }
      });


      return html;
    } catch (err) {
      console.error("Error parsing or rendering sticker:", err);
      return "";
    }
  }
}
