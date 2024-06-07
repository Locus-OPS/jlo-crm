import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ModalConfirmComponent } from '../../common/modal-confirm/modal-confirm.component';
import { LineUserProfile } from '../liff.model';
import { LiffService } from '../liff.service';
import { LineService } from '../line.service';

@Component({
  selector: 'app-line-receipt-upload',
  templateUrl: './receipt-upload.component.html',
  styleUrls: ['./receipt-upload.component.scss']
})
export class LineReceiptUploadComponent implements OnInit {

  liffId = '1653967605-DobZKzpA';
  selectedFiles: FileList;
  imageSrc: string;

  userProfile: LineUserProfile;

  constructor(
    private location: Location,
    private dialog: MatDialog,
    private liffService: LiffService,
    private lineService: LineService,
  ) {
  }

  ngOnInit() {
    this.initLineLiff();
  }

  async initLineLiff() {
    try {
      this.userProfile = await this.liffService.initLineLiff(this.liffId);
    } catch (err) {
      // alert(err);
    }
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = <string>reader.result;

      reader.readAsDataURL(file);
    }
  }

  onBack() {
    this.location.back();
  }

  onScan() {
    this.liffService.scan().then(result => {
      alert(JSON.stringify(result));
    });
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      maxWidth: '80%',
      data: {
        title: 'แจ้งเตือน',
        message: `ยืนยันการทำรายการ`
      }
    });
  }
}
