import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LineService } from '../line.service';
import { ModalConfirmComponent } from '../../common/modal-confirm/modal-confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-line-reward-address',
  templateUrl: './reward-address.component.html',
  styleUrls: ['./reward-address.component.scss']
})
export class LineRewardAddressComponent implements OnInit {

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private lineService: LineService,
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  ngOnInit() {

  }

  onBack() {
    this.location.back();
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      maxWidth: '80%',
      data: {
        title: 'แจ้งเตือน',
        message: `ยืนยันการแลกของกำนัล`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/line-liff/redeem']);
    });
  }

}
