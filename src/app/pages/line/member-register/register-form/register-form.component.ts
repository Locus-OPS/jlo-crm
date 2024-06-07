import { OnInit, Component, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-line-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class LineRegisterFormComponent implements OnInit {

  @Input() type: string;
  @Output() back = new EventEmitter<string>();
  @Output() next = new EventEmitter<any>();

  createForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      taxNo: ['']
      , mobileNo: ['']
    });
  }

  onBack() {
    this.back.emit();
  }

  onNext() {
    this.next.emit({
      taxNo: this.createForm.controls['taxNo'].value
      , mobileNo: this.createForm.controls['mobileNo'].value
    });
  }

}
