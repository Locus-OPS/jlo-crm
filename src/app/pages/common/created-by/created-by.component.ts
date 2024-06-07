import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-created-by',
  templateUrl: './created-by.component.html',
  styleUrls: ['./created-by.component.scss']
})
export class CreatedByComponent implements OnChanges {

  @Input() createdBy: string;
  @Input() createdDate: string;
  @Input() updatedBy: string;
  @Input() updatedDate: string;

  createdForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
    ) {
      this.createdForm = this.formBuilder.group({
        createdBy: [''],
        createdDate: [''],
        updatedBy: [''],
        updatedDate: ['']
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createdForm.patchValue({
      createdBy: this.createdBy,
      createdDate: this.createdDate,
      updatedBy: this.updatedBy,
      updatedDate: this.updatedDate
    });
  }
}
