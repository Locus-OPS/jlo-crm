import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-group',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat-group.component.html',
  styleUrl: './chat-group.component.scss'
})
export class ChatGroupComponent extends BaseComponent implements OnInit {

  createForm: FormGroup;
  users = [];
  selectedUsers: string[] = [];
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
    const controls = this.users.map(() => this.formBuilder.control(false));
    this.createForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      users: this.formBuilder.array(controls),
    });
    this.getUserList();
  }
  get users1() {
    return this.createForm.get('users') as FormArray;
  }

  getUserList() {
    this.chatService.getUserList({ data: { userChatName: "" }, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
      }
    });
  }

  createGroup() {
    alert(JSON.stringify(this.createForm.getRawValue()));
    if (!this.createForm.valid) {
      return;
    }
  }

}
