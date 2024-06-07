import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CustomerVerifyData } from './customer-verify-data';

@Component({
  selector: 'app-verify-customer-dialog',
  templateUrl: './verify-customer-dialog.component.html',
  styleUrls: ['./verify-customer-dialog.component.scss']
})
export class VerifyCustomerDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<VerifyCustomerDialogComponent>,@Inject(MAT_DIALOG_DATA) public data:CustomerVerifyData) {

  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
