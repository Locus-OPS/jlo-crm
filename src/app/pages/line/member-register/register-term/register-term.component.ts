import { OnInit, Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-line-register-term',
  templateUrl: './register-term.component.html',
  styleUrls: ['./register-term.component.scss']
})
export class LineRegisterTermComponent implements OnInit {

  @Output() back = new EventEmitter<string>();
  @Output() next = new EventEmitter<string>();

  step = '1';
 
  ngOnInit() {

  }

  onAccept() {
    this.step = '2';
  }

  onNext() {
    this.next.emit();
  }

}