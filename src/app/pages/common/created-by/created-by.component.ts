import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
    selector: 'app-created-by',
    templateUrl: './created-by.component.html',
    styleUrls: ['./created-by.component.scss'],
    imports: [SharedModule]
})
export class CreatedByComponent implements OnChanges {

  @Input() createdBy: string;
  @Input() createdDate: string;
  @Input() updatedBy: string;
  @Input() updatedDate: string;

  createdForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder
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
