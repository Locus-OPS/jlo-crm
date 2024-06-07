import { Component, OnInit } from '@angular/core';
import { LineService } from './line.service';
import { LiffService } from './liff.service';
import { LineUserProfile } from './liff.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-line-liff',
  templateUrl: './liff.component.html',
  styleUrls: ['./liff.component.scss']
})
export class LineLiffComponent implements OnInit {

  liffId = '1653938456-yNnB8W4j';
  userProfile: LineUserProfile;

  memberId = '';
  type = '';

  constructor(
    private lineService: LineService,
    private liffService: LiffService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
   this.initLineLiff();
  }

  async initLineLiff() {
    try {
      this.userProfile = await this.liffService.initLineLiff(this.liffId);
      this.checkMemberRegister();
    } catch (err) {
      // alert(err);
    }
  }

  checkMemberRegister() {
    this.lineService.checkMemberRegister({
      data: this.userProfile.userId
    }).then(result => {
      if (result.status && result.data) {
        this.memberId = result.data;
        this.type = this.activatedRoute.snapshot.paramMap.get('type');
      } else {
        this.type = 'register';
      }
    });
  }

}
