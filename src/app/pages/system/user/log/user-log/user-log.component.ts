import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { LoginLogComponent } from '../login-log/login-log.component';

@Component({
    selector: 'app-user-log',
    templateUrl: './user-log.component.html',
    styleUrls: ['./user-log.component.scss'],
    imports: [SharedModule, LoginLogComponent]
})
export class UserLogComponent implements OnInit {

  userId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userId = data.userId;
  }

  ngOnInit() {
  }

}
