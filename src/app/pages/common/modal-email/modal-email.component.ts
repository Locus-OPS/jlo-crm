import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { EmailTemplateService } from '../../system/email-template/email-template.service';
import { ModalEmailService } from './modal-email.service';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';




@Component({
  selector: 'app-modal-email',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-email.component.html',
  styleUrl: './modal-email.component.scss'
})
export class ModalEmailComponent extends BaseComponent implements OnInit {

  emailTemplateList: Dropdown[];
  emailFrom: Dropdown[];
  parentModule: string = "01";
  fromEmail: string;
  toEmail: string = "apichathot@gmail.com";
  emailTemplate: string;

  sendEmailForm: FormGroup;
  form: FormGroup;
  result: string;

  title: string;

  subjectEmail: string;
  attachmentId: string;
  fileDocName: string;
  nameOfCompany: string;
  documentType: string;
  documentTypeDesc: string;
  parentId: string;
  fileName: string;

  fileNameList: any[];

  tableControl: TableControl = new TableControl(() => { this.dataIn.emailData.fileNameList });
  displayedColumns: string[] = ['fileName'];

  modules: any;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private dialogRef: MatDialogRef<ModalEmailComponent>,
    private templateService: EmailTemplateService,
    private emailService: ModalEmailService,
    @Inject(MAT_DIALOG_DATA) public dataIn: any,
  ) {
    super(router, globals);
    Quill.register('modules/imageHandler', ImageHandler);
    Quill.register('modules/videoHandler', VideoHandler);

    templateService.getEmailTemplateByModule({ data: { module: 'CASE' } }).then(result => {
      if (result.status) {
        this.emailTemplate = result.data.templateHtmlCode;
        this.replaceTemplate(this.emailTemplate);
      }

    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });




    // api.getMultipleCodebookByCodeType(
    //   { data: ['EMAIL_TEMPLATE_HTML'] }
    // ).then(result => {
    //   this.emailTemplateList = result.data['EMAIL_TEMPLATE_HTML'];

    //   this.emailTemplateList.findIndex(values => {
    //     console.log(values.codeId);
    //     console.log(this.parentModule + "==" + values.codeId)
    //     if (this.parentModule == values.codeId) {
    //       this.emailTemplate = values.description;
    //       this.fromEmail = values.etc1;
    //       this.subjectEmail = values.etc2;
    //     }
    //   });
    //this.replaceTemplate(this.emailTemplate);
    // });

    this.modules = {
      // toolbar: [
      //   ['image', 'video']
      // ],
      imageHandler: {
        upload: (file) => {
          console.log("Sample API Call")
          return // your uploaded image URL as Promise<string>
        },
        accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
      } as Options,
      videoHandler: {
        upload: (file) => {
          return // your uploaded video URL as Promise<string>
        },
        accepts: ['mpeg', 'avi']  // Extensions to allow for videos (Optional) | Default - ['mp4', 'webm']
      } as Options
    };



  }

  ngOnInit() {

    this.parentModule = this.dataIn.parentModule;
    this.parentId = this.dataIn.parentId;

    // console.log("ngOnInit dataIn : "+this.parentModule);
    // console.log(this.dataIn);

    if (this.dataIn) {
      this.title = this.dataIn.title;
      this.subjectEmail = this.dataIn.subjectEmail;
    }



    this.sendEmailForm = this.formBuilder.group({
      attachmentId: [this.attachmentId],
      fileName: [this.fileName],
      fileDocName: [this.fileDocName],
      documentType: [this.documentType],
      documentTypeDesc: [this.documentTypeDesc],
      fromEmail: [],
      toEmail: ['apichathot@gmail.com', Validators.required],
      ccEmail: [''],
      subjectEmail: [this.subjectEmail],
      bodyEmail: [this.emailTemplate],
      parentId: [this.parentId],
      parentModule: [this.parentModule]

    });

  }



  replaceTemplate(bodyEmail: string) {
    // this.fileNameList = this.dataIn.emailData.fileNameList;

    // bodyEmail = bodyEmail.replace('$caseNo', this.dataIn.emailData.caseNo);
    // bodyEmail = bodyEmail.replace('$riskLevel', this.dataIn.emailData.riskLevel);
    // bodyEmail = bodyEmail.replace('$subject', this.dataIn.emailData.subject);
    // bodyEmail = bodyEmail.replace('$typeOfReport', this.dataIn.emailData.typeOfReport);
    // bodyEmail = bodyEmail.replace('$whistleblowerName', this.dataIn.emailData.whistleblowerName);
    // bodyEmail = bodyEmail.replace('$orderNo', this.dataIn.emailData.orderNo);
    // bodyEmail = bodyEmail.replace('$memberNo', this.dataIn.emailData.memberNo);
    // bodyEmail = bodyEmail.replace('$phoneContact', this.dataIn.emailData.phoneContact);
    // bodyEmail = bodyEmail.replace('$location', this.dataIn.emailData.location);
    // bodyEmail = bodyEmail.replace('$description', this.dataIn.emailData.description);
    // bodyEmail = bodyEmail.replace('$dueDate', this.dataIn.emailData.dueDate);
    console.log(bodyEmail);
    this.sendEmailForm.patchValue({
      fromEmail: this.fromEmail,
      bodyEmail: bodyEmail,
      toEmail: this.toEmail,
      subjectEmail: this.subjectEmail
    });


  }


  onSendEmail() {
    const param = {
      ...this.sendEmailForm.value
    };

    if (this.sendEmailForm.invalid) {
      console.log("Invalid Email");
      this.sendEmailForm.markAllAsTouched();
      return;
    }

    this.sendEmail(param);
    //this.sendEmailWithMultiAtt(param);

  }

  sendEmail(param) {

    const msgTitle = 'Sent!';
    const msgText = 'E-mail has been sent successfully.';

    this.emailService.sendEmail({
      data: param
    }).then(result => {

      if (result.status) {

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        this.dialogRef.close();

      } else {
        Utils.alertError({
          text: 'Save failed, please try again later.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });

  }

  sendEmailWithMultiAtt(param) {
    const msgTitle = 'Sent!';
    const msgText = 'E-mail has been sent successfully.';

    this.emailService.sendEmailWithMultiAtt({
      data: param
    }).then(result => {

      if (result.status) {

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        this.dialogRef.close();

      } else {
        Utils.alertError({
          text: 'Save failed, please try again later.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });


  }

  onSendEmailWithAprrove(paramEmail) {
    let param = {
      auditPlanId: this.parentId,
      planStatusId: this.dataIn.planStatusId
    };

    // this.engagementDetailService.updatePlanStatus({
    //   data: param
    // }).then(result => {
    //   if (result.status) {
    //     this.sendEmailWithAprrove(paramEmail);
    //   } else {
    //     Utils.alertError({
    //       text: 'Please try again later.',
    //     });
    //   }
    // }, error => {
    //   Utils.alertError({
    //     text: 'Please try again later.',
    //   });
    // });

  }

  sendEmailWithAprrove(paramEmail) {
    const msgTitle = 'Sent!';
    const msgText = 'E-mail has been sent successfully.';

    // this.emailService.sendEmailWithAtt({
    //   data: paramEmail
    // }).then(result => {

    //   if (result.status) {

    //     Utils.alertSuccess({
    //       title: msgTitle,
    //       text: msgText,
    //     });
    //     this.dialogRef.close();

    //   } else {
    //     Utils.alertError({
    //       text: 'Save failed, please try again later.',
    //     });
    //   }
    // }, error => {
    //   Utils.alertError({
    //     text: 'Please, try again later',
    //   });
    // });

  }

  onCancel() {

  }

}