import { OnInit, Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-line-register-otp',
  templateUrl: './register-otp.component.html',
  styleUrls: ['./register-otp.component.scss']
})
export class LineRegisterOTPComponent implements OnInit {

  @Output() back = new EventEmitter<string>();
  @Output() next = new EventEmitter<string>();

  step = 'REQUEST';

  ngOnInit() {

  }

  onBack() {
    this.back.emit();
  }

  onNext() {
    if (this.step === 'REQUEST') {
      this.step = 'CONFIRM';
    } else {
      this.next.emit();
    }
  }

}