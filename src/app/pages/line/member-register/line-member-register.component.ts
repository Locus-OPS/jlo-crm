import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LiffService } from '../liff.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LineService } from '../line.service';
import { LineUserProfile } from '../liff.model';

@Component({
  selector: 'app-line-member-register',
  templateUrl: './line-member-register.component.html',
  styleUrls: ['./line-member-register.component.scss']
})
export class LineMemberRegisterComponent implements OnInit {

  @Input() liffId: string;
  @Output() registered = new EventEmitter<number>();

  userProfile: LineUserProfile;

  cardNo;
  mobileNo;
  type;

  step = 'SELECTION';

  constructor(
    private liffService: LiffService,
    private lineService: LineService,
    private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.initLineLiff();
  }

  async initLineLiff() {
    try {
      this.userProfile = await this.liffService.initLineLiff(this.liffId);
    } catch (err) {
      // alert(err);
    }
  }

  onSelectType(type) {
    if (type === '2') {
      this.type = 'SUBDEALER';
      this.step = 'FORM';
    } else {
      this.type = 'DEALER';
      this.step = 'FORM';
    }
  }

  onFormBack() {
    this.step = 'SELECTION';
  }

  onFormNext(event) {
    this.cardNo = event.taxNo;
    this.mobileNo = event.mobileNo;
    this.step = 'OTP';
  }

  onOTPBack() {
    this.step = 'FORM';
  }

  onOTPNext() {
    this.step = 'TERM';
  }

  onTermNext() {
    // this.registered.emit(55);
    this.register();
  }

  register() {
    this.lineService.register({
      data: {
        lineId: this.userProfile.userId
        , cardNo: this.cardNo
        , mobileNo: this.mobileNo
      }
    }).then(result => {
      if (result.status) {
        this.registered.emit(result.data);
      } else {
        alert(result.message);
      }
    });
  }

}
