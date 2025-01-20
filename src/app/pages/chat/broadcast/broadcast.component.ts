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
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public chatService: ChatService,
  ) {
    super(router, globals);
  }
  ngOnInit(): void {
    this.initForm();
    if (this.broadCastForm.get('messageType').value === 'private') {
      this.getUserList();
    } else {
      this.getChatGroupList();
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
        //console.log(res.data);
      }
    });
  }


}
