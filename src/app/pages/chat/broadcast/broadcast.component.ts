import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from '../chat.service';
import Utils from 'src/app/shared/utils';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-broadcast',
    imports: [SharedModule],
    templateUrl: './broadcast.component.html',
    styleUrl: './broadcast.component.scss'
})
export class BroadcastComponent extends BaseComponent implements OnInit {

  broadCastForm: FormGroup;
  selectedOption: string = '';
  users = [];
  chatGroups = [];
  isSelectUserAll: boolean = false;
  isSelectGroupAll: boolean = false;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public chatService: ChatService,
    private dialogRef: MatDialogRef<BroadcastComponent>
  ) {
    super(router, globals);
    this.connect();
  }
  ngOnInit(): void {
    this.initForm();
    if (this.broadCastForm.get('messageType').value === 'private') {
      this.getUserList();
    } else {
      this.getChatGroupList();
    }

  }

  connect(): void {
    const userId = this.globals.profile.id.toString();
    if (userId.trim()) {
      this.chatService.connect(userId);
    } else {
      alert('กรุณากรอกชื่อผู้ใช้!');
    }
  }

  initForm() {
    this.broadCastForm = this.formBuilder.group({
      message: ['', Validators.required],
      messageType: ["private"]
    });

  }

  onSelectionChange() {
    this.selectedOption = this.broadCastForm.get('messageType')?.value;
    console.log('Selected Option:', this.selectedOption); // แสดงผลค่า

    if (this.broadCastForm.get('messageType').value === 'private') {
      this.getUserList();
    } else {
      this.getChatGroupList();
    }
  }

  getUserList() {
    this.chatService.getUserList({ data: { userChatName: "" }, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
      }
    });
  }

  getChatGroupList() {
    this.chatService.getChatRoomList({ data: {}, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.chatGroups = res.data;
      }
    });
  }

  onUserChange(user: any, index: any) {
    if (index >= 0 && index < this.users.length) {
      this.users[index] = { ...this.users[index], checked: !user.checked }; // Merge ข้อมูลใหม่
    } else {
      console.error("Invalid index!");
    }
    if (user.checked) {
      this.isSelectUserAll = false;
    }
  }

  onSelectedAllUserChange() {
    if (!this.isSelectUserAll) {
      this.users = this.users.map(user => ({
        ...user,
        checked: true
      }));
      this.isSelectUserAll = true;
    } else {
      this.users = this.users.map(user => ({
        ...user,
        checked: false
      }));
      this.isSelectUserAll = false;
    }

  }

  onGroupChange(chatGroup: any, index: any) {
    if (index >= 0 && index < this.chatGroups.length) {
      this.chatGroups[index] = { ...this.chatGroups[index], checked: !chatGroup.checked }; // Merge ข้อมูลใหม่
    } else {
      console.error("Invalid index!");
    }
    if (chatGroup.checked) {
      this.isSelectGroupAll = false;
    }
  }

  onSelectedAllGroupChange() {
    if (!this.isSelectGroupAll) {
      this.chatGroups = this.chatGroups.map(group => ({
        ...group,
        checked: true
      }));
      this.isSelectGroupAll = true;
    } else {
      this.chatGroups = this.chatGroups.map(group => ({
        ...group,
        checked: false
      }));
      this.isSelectGroupAll = false;
    }
  }

  createBroadcast() {
    if (!this.broadCastForm.valid) {
      return;
    }

    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {

          if (this.broadCastForm.get('messageType').value === 'private') {
            const selectedUsers = this.users.filter(user => user.checked).map(user => user.id);
            if (selectedUsers.length > 0) {
              this.sendMessagePrivate(selectedUsers);
              this.dialogRef.close(true);
            } else {
              alert('กรุณาเลือกผู้ใช้อย่างน้อย 1 คน');
            }
          } else if (this.broadCastForm.get('messageType').value === 'public') {
            const selectedGroups = this.chatGroups.filter(group => group.checked);
            if (selectedGroups.length > 0) {
              this.sendMessagePublic(selectedGroups);
              this.dialogRef.close(true);
            } else {
              alert('กรุณาเลือกกลุ่มอย่างน้อย 1 กลุ่ม');
            }
          }

        } else {
          console.log('Cancelled');
        }
      });


  }

  sendMessagePrivate(users) {
    const promises = users.map(user =>
      this.chatService.sendMessage(`/private ${user} ${this.broadCastForm.get('message').value}`)
    );
    Promise.all(promises)
      .then(results => {
        console.log("All API Results:", results); // อาร์เรย์ของผลลัพธ์ทั้งหมด
      })
      .catch(error => {
        console.error("Error in API requests:", error);
      });
  }

  async sendMessagePublic(groups) {
    // alert(JSON.stringify(groups));
    for (const group of groups) {
      // ใช้ group.roomId เพื่อดึงค่า roomId ของแต่ละ group
      await this.chatService.sendMessage(`/join ${group.roomId}`);
      await this.chatService.sendMessage(this.broadCastForm.get('message').value);
    }
    console.log('All groups processed');
  }




}
