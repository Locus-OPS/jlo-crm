import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LineService } from '../line.service';
import { ModalConfirmComponent } from '../../common/modal-confirm/modal-confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-line-xcash-detail',
  templateUrl: './xcash-detail.component.html',
  styleUrls: ['./xcash-detail.component.scss']
})
export class LineXcashDetailComponent implements OnInit {

  typeList = [
    { type: 1, text: '1,000 คะแนน = 100 xCash' }
    , { type: 2, text: '2,000 คะแนน = 200 xCash' }
    , { type: 3, text: '5,000 คะแนน = 500 xCash' }
  ];

  step = 1;
  resultMessage1 = '';
  resultMessage2 = '';

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  ngOnInit() {

  }

  onBack() {
    this.router.navigate(['/line-liff/redeem']);
  }

  confirmTransfer(type) {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      maxWidth: '80%',
      data: {
        title: 'แจ้งเตือน',
        message: `ยืนยันการใช้คะแนนเพื่อแลกไปเป็น xCash`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.step = 2;
      const tmp = this.typeList.filter(item => item.type === type)[0].text.split('=');
      this.resultMessage1 = `ใช้คะแนน ${tmp[0]}`;
      this.resultMessage2 = `แลกเป็น ${tmp[1]}`;
    });
  }

}
