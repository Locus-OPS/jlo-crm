import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ChatService } from './chat.service';

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
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public chatService: ChatService
  ) {
    super(router, globals);
    this.getUserList();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
    // this.getUserList();
  }

  getUserList() {
    this.chatService.getUserList({ data: null, pageNo: 0, pageSize: 100000 }).then((res) => {
      if (res.status) {
        this.users = res.data;
        console.log(res.data);
      }
      console.log("Error");
    });
  }

  onSelectUser(user: any) {
    this.user = user;
    //alert(JSON.stringify(user));
  }

  onScroll(event: any): void {
    console.log(event.target);
    // const target = event.target;
    // if (target.scrollTop + target.clientHeight >= target.scrollHeight && !this.loading) {
    //   this.loadMoreData();
    // }
  }

}
