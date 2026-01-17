import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmailInboundService } from '../email-inbound.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import Utils from 'src/app/shared/utils';
import Quill from 'quill';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalContentFileComponent } from '../../common/modal-file/modal-file.component';

@Component({
  selector: 'app-email-inbound-detail',
  imports: [SharedModule],
  templateUrl: './email-inbound-detail.component.html',
  styleUrl: './email-inbound-detail.component.scss'
})
export class EmailInboundDetailComponent extends BaseComponent implements OnInit {

  createForm: FormGroup;
  modules: any = {};
  attItemsList: any[] = [];

  fileName: string;
  fileType: string;
  fileTempUrl: string;
  fileUrl: SafeResourceUrl;
  downloadfileUrl: SafeResourceUrl;

  constructor(
    private formBuilder: FormBuilder,
    private emailIbService: EmailInboundService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public api: ApiService,
    private tabParam: TabParam,
    public sanitizer: DomSanitizer,
  ) {
    super(router, globals);
  }

  ngOnInit(): void {

    this.createForm = this.formBuilder.group({
      id: [''],
      formEmail: [''],
      toEmail: [''],
      subjectEmail: [''],
      plainContent: [""],
      htmlContent: [""],
      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: ['']
    });

    this.modules = {
      toolbar: { container: [] },
    };

    this.getEmailInboundDetail();

    this.getEmailInboundAttListById();
  }


  getEmailInboundDetail() {
    if (this.tabParam.params['id']) {
      console.log("this.tabParam.params['id'] " + this.tabParam.params['id']);

      this.createForm.patchValue({ id: this.tabParam.params['id'] });

      this.emailIbService.getEmailInboundDetailById({ data: { id: this.tabParam.params['id'] } })
        .then(result => {
          this.createForm.patchValue(result.data);
        }, error => {
          Utils.alertError({
            text: 'กรุณาลองใหม่ภายหลัง',
          });
        });
    }
  }


  getEmailInboundAttListById() {

    if (this.tabParam.params['id']) {
      this.emailIbService.getEmailInboundAttListById({ data: { id: this.tabParam.params['id'] } }).then(res => {
        console.log(res.data);
        this.attItemsList = res.data;


      });
    }
  }


  openAttachmentDialog(attId: number, fileExtension: string, fileName: string) {
    const dialogRef = this.dialog.open(ModalContentFileComponent, {
      data: {
        attId: attId,
        fileExtension: fileExtension,
        fileName: fileName
      }
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

}
