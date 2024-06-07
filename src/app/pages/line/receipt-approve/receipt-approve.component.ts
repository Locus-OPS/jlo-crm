import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ModalConfirmComponent } from '../../common/modal-confirm/modal-confirm.component';

interface Receipt {
  name: string;
  receiptNo: string;
  receiptDate: string;
  amount: number;
}

@Component({
  selector: 'app-line-receipt-approve',
  templateUrl: './receipt-approve.component.html',
  styleUrls: ['./receipt-approve.component.scss']
})
export class LineReceiptApproveComponent implements OnInit {

  receiptList: Receipt[] = [
    {
      name: 'ชัยวัฒน์ การช่าง'
      , receiptNo: '123421231'
      , receiptDate: '17/04/2020'
      , amount: 17309
    }, {
      name: 'ชัยวัฒน์ การช่าง'
      , receiptNo: '221321321'
      , receiptDate: '15/04/2020'
      , amount: 78222
    }
  ];
  receipt: Receipt;

  state = 'LIST';

  //thumb = 'https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg';
  thumb = 'assets/img/receipt_sample.png';

  constructor(
    private location: Location,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {

  }

  receiptDetailPage(receipt) {
    this.receipt = receipt;
    this.state = 'DETAIL';
  }

  onBack() {
    if (this.state === 'DETAIL') {
      this.state = 'LIST';
    } else {
      this.location.back();
    }
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      maxWidth: '80%',
      data: {
        title: 'แจ้งเตือน',
        message: `ยืนยันอนุมัติข้อมูลใบเสร็จ`
      }
    });
  }

  onCancel() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      maxWidth: '80%',
      data: {
        title: 'แจ้งเตือน',
        message: `ยืนยันปฏิเสธข้อมูลใบเสร็จ`
      }
    });
  }

}
