
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';


@Component({
  selector: 'modal-file.component',
  templateUrl: 'modal-file.component.html',
  styleUrls: ['./modal-file.component.scss']
})
export class ModalContentFileComponent extends BaseComponent implements OnInit {

  fileAttachment: string;
  urlSrc: string;
  attId: string;
  attIdGet: number;
  fileName: string;
  fileExtension: string;

  fileType: string;
  fileTempUrl: string;
  fileUrl: SafeResourceUrl;

  downloadfileUrl: SafeResourceUrl;

  constructor(

    public api: ApiService,
    private dialogRef: MatDialogRef<ModalContentFileComponent>,
    public sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) data,
    public router: Router,
    public globals: Globals) {
      super(router, globals);
      this.attId = data.attId;
      this.fileExtension = data.fileExtension;
      this.fileName = data.fileName;
  }

  ngOnInit(): void {

    sanitizer: DomSanitizer;
    this.attId = this.attId;
    this.attIdGet = parseInt(this.attId);
    console.log("Dialog AttachtmentId : " + this.attId);


    this.api.getAttachmentByAttId(this.attIdGet).subscribe(res => {

      var resFileURL = URL.createObjectURL(res);
      console.log(res.type);
      this.fileType = res.type;
      console.log(resFileURL);
      if (this.isFileCanDisplay(this.fileType)) {

        this.fileTempUrl = resFileURL;
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileTempUrl);

      } else {

        this.fileUrl = null;
        this.downloadfileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(res));

      }

    });

  }



  isFileCanDisplay(file: string) {
    if (this.isFileViews(file)) {
      return true;
    } else {
      return false;
    }

  }

  isFileViews(type: string) {
    const acceptedTypes = ['image/gif', 'image/jpeg', 'image/png', 'application/pdf', 'text/plain', 'audio/x-wav'];

    return acceptedTypes.includes(type)
  }

}
