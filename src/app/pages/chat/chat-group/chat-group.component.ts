import { Component, Inject, Input, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from '../chat.service';
import Utils from 'src/app/shared/utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { create } from 'domain';

@Component({
  selector: 'app-chat-group',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat-group.component.html',
  styleUrl: './chat-group.component.scss'
})
export class ChatGroupComponent extends BaseComponent implements OnInit {
  // @Input() chatGroup: any;
  createForm: FormGroup;
  users = [];
  selectedUsers: string[] = [];
  isSelectUserAll: boolean = false;
  mode = 'create';
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public chatService: ChatService,
    private dialogRef: MatDialogRef<ChatGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public chatGroup: any,
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    // alert(JSON.stringify(this.chatGroup.roomId));
    if (this.chatGroup.roomId != null) {
      this.getChatGroup();
      this.mode = 'edit';
    } else {
      this.mode = 'create';
      this.getUserList();
    }

    this.createForm = this.formBuilder.group({
      roomId: [],
      roomName: [, Validators.required],
      userList: [''],
      createdBy: [''],
    });

  }

  // คืนค่า FormArray
  get userList(): FormArray {
    return this.createForm.get('userList') as FormArray;
  }

  getChatGroup() {
    // alert(this.chatGroup.roomId);
    this.chatService.getChatRoomById({ data: { roomId: this.chatGroup.roomId } }).then((res) => {
      if (res.status) {
        this.createForm.patchValue(res.data);
        this.users = res.data.userList;
      }
    });
  }

  getUserList() {
    this.chatService.getUserList({ data: { userChatName: "" }, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
      }
    });
  }

  createGroup() {
    if (!this.createForm.valid) {
      return;
    }

    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {

          this.chatService.createChatRoom({ data: { ...this.createForm.getRawValue(), userList: this.users } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Chat room has been created." });
              this.dialogRef.close('create');
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  // ฟังก์ชันสำหรับจัดการค่า Checkbox
  onCheckboxUserChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      // เพิ่มค่าที่เลือกใน Array
      this.userList.push(this.formBuilder.control(value));
    } else {
      // ลบค่าที่ไม่ได้เลือกออกจาก Array
      const index = this.userList.controls.findIndex(x => x.value === value);
      this.userList.removeAt(index);
    }
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

  editChatRoom() {
    if (!this.createForm.valid) {
      return;
    }
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {

          this.chatService.updateChatRoom({ data: { ...this.createForm.getRawValue(), userList: this.users } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Chat room has been updated." });
              this.dialogRef.close('edit');
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  deleteChatRoom() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          this.chatService.deleteChatRoom({ data: { ...this.createForm.getRawValue(), userList: this.users } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Chat room has been deleted." });
              this.dialogRef.close('delete');
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }


}
