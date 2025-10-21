import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LinemsgService } from '../linemsg.service';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-linemessaging',
  imports: [SharedModule],
  templateUrl: './linemessaging.html',
  styleUrl: './linemessaging.scss'
})
export class Linemessaging extends BaseComponent implements OnInit {
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
  imageUrl: string | null = null;
  // messageId: string = '583427211504910473';
  private subscription: Subscription | null = null;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public linemsgService: LinemsgService,
    public dialog: MatDialog,
    public chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {
    super(router, globals);
    this.connect();

  }
  ngOnInit(): void {
    this.initForm();
    this.subscription = this.chatService.getMessages().subscribe((message: string) => {
      try {
        console.log("Received message in Task Queue: ", JSON.stringify(message));
        let msg = JSON.parse(message);
        if (msg.channelType === "LINE") {
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

  connect(): void {
    const userId = this.globals.profile.id.toString();
    if (userId.trim()) {
      this.chatService.connect(userId);
    } else {
      console.error('Username is required to connect to WebSocket.');
    }
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      displayName: ['']
    });
  }

  searchData() {
    this.getAllLineUsers();
  }

  searchDataFromSearchBar() {
    this.currentPage = 0;
    this.users = [];
    this.getAllLineUsers();
  }

  getAllLineUsers() {
    const param = this.searchForm.getRawValue();
    this.linemsgService.getAllLineUsers({ data: param, pageNo: this.currentPage, pageSize: this.pageSize }).then((res) => {
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

  joinRoom(): void {
    if (this.room.toString().trim()) {
      this.chatService.sendMessage(`/join LINE-${this.room}`);
    }
  }

  getInteractionList() {
    if (!this.selectedUser) return;
    this.linemsgService.getInteractionList({ data: { ...this.selectedUser }, pageNo: this.chatCurrentPage, pageSize: this.chatPageSize }).then((res) => {
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
    this.linemsgService.sendMessage({ data: { userId: this.selectedUser.id, messageText: this.newMessage } }).then((res) => {
      if (res.status) {
        this.newMessage = '';
      } else {
        console.error(res.message);
      }
    });
  }

  loadMore() {
    this.currentPage = this.currentPage + 1;
    this.getAllLineUsers();
  }

  loadMoreChat() {
    this.chatCurrentPage = this.chatCurrentPage + 1;
    this.getInteractionList();
  }

  addCase(interaction) {

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

  getSticker(payload: any) {
    // ถ้า payload เป็น string → แปลงเป็น object ก่อน
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        console.error("❌ ไม่สามารถแปลง payload เป็น JSON ได้:", e);
        return "<p>รูปแบบ payload ไม่ถูกต้อง</p>";
      }
    }

    // ตรวจสอบว่ามี events หรือไม่
    if (!payload?.events || !Array.isArray(payload.events) || payload.events.length === 0) {
      return "<p>ไม่พบ event ใน payload</p>";
    }

    // ดึง event แรก (หรือจะ loop ทั้งหมดก็ได้)
    const event = payload.events[0];
    if (!event?.message) {
      return "<p>ไม่พบ message ใน event</p>";
    }

    const msg = event.message;
    let html = "";

    switch (msg.type) {
      case "sticker":
        const stickerId = msg.stickerId;
        const resType = msg.stickerResourceType;
        const stickerUrl =
          resType === "ANIMATION"
            ? `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/IOS/sticker_animation@2x.png`
            : `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/ANDROID/sticker.png`;
        html = `
        <div class="line-sticker">
          <img src="${stickerUrl}" alt="sticker" width="120" style="border-radius:12px;">
        </div>
      `;
        break;
    }

    return html;
  }

  async loadContent(interaction: any) {
    // ตั้งสถานะ "กำลังโหลด"
    interaction.isLoadingMedia = true;
    interaction.loadedDataUrl = null; // เคลียร์ของเก่า (ถ้ามี)

    const messageId = interaction.attachmentUrl; // หรือ ID ที่ถูกต้อง
    if (!messageId) {
      console.error('Interaction has no messageId!');
      interaction.isLoadingMedia = false;
      return;
    }

    try {
      // 4. เรียก Service (ที่คาดหวังว่าจะได้ ApiResponse<string> กลับมา)
      const res = await this.linemsgService.getContent(messageId);

      if (res.status && res.data) {
        // 5. **สำคัญ:** ใช้ bypassSecurityTrustUrl สำหรับ [src]
        // res.data คือ "data:image/jpeg;base64,..." หรือ "data:video/mp4;base64,..."
        interaction.loadedDataUrl = this.sanitizer.bypassSecurityTrustUrl(res.data);

      } else {
        console.error('Failed to load media:', res.message);
        // (Optional) เก็บข้อความ error ไว้แสดงผล
        interaction.loadError = res.message || 'Failed to load media.';
      }

    } catch (error) {
      console.error('Error fetching media:', error);
      interaction.loadError = 'An error occurred.';

    } finally {
      // 6. แจ้ง UI ว่าโหลดเสร็จแล้ว (ไม่ว่าจะสำเร็จหรือล้มเหลว)
      interaction.isLoadingMedia = false;
    }
  }


}
