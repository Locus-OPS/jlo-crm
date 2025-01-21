import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-broadcast',
  standalone: true,
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
      alert('Please enter your username!');
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
    alert(JSON.stringify(this.users));
    alert(JSON.stringify(this.chatGroups));
  }




}
