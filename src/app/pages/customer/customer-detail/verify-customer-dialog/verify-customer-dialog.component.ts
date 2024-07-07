import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerVerifyData } from './customer-verify-data';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'app-verify-customer-dialog',
  templateUrl: './verify-customer-dialog.component.html',
  styleUrls: ['./verify-customer-dialog.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class VerifyCustomerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VerifyCustomerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: CustomerVerifyData) {

  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
