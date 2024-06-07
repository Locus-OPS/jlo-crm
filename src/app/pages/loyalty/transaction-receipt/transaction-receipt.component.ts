import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionReceiptService } from './transaction-receipt.service';
import { ModalMemberComponent } from '../../common/modal-member/modal-member.component';
import { ModalShopComponent } from '../../common/modal-shop/modal-shop.component';
import { ReceiptModel } from './transaction-receipt.model';
import Utils from 'src/app/shared/utils';


@Component({
  selector: 'app-transaction-receipt',
  templateUrl: './transaction-receipt.component.html',
  styleUrls: ['./transaction-receipt.component.scss']
})
export class TransactionReceiptComponent extends BaseComponent implements OnInit {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;
  
  createForm: FormGroup;
  
  receiptInfo: ReceiptModel;

  constructor(
    public api: ApiService,
    private receiptService: TransactionReceiptService,
    public router: Router,
    public globals: Globals,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    super(router, globals);
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      memberId: ['', Validators.required],
      memberName: [''],
      memberTierName: [''],
      programId: [''],
      receiptDate: ['', Validators.required],
      receiptId: ['', Validators.required],
      shopId: ['', Validators.required],
      shopTypeName: [''],
      shopName: [''],
      spending: ['', Validators.required]
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSave(e) {
    const msgTitle = 'Created!';
    const msgText = 'Receipt has been created.';
    const param = {
      ...this.createForm.value
      , receiptDate: Utils.getDateString(this.createForm.value['receiptDate'])
    };

    if (this.createForm.invalid) {
      return;
    }

    this.receiptService.saveReceipt({
      data: param
    }).then(result => {
      console.log(result);
      if (result.status) {
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        if (this.createFormDirective) {
          this.createFormDirective.resetForm();
        }
      }else{
        Utils.alertError({
          title: 'Warning!',
          text: result.message,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  searchMember(){
    const dialogRef = this.dialog.open(ModalMemberComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue(result);
      }
    });
  }

  searchShop(){
    const dialogRef = this.dialog.open(ModalShopComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue(result);
      }
    });
  }
}
