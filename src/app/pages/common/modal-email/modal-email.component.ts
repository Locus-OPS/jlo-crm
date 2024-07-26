import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { EmailModel } from './modal-email.model';
import { HttpResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/model/api-response.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ModalCustomerComponent } from '../modal-customer/modal-customer.component';

interface Emails {
  email: string;
}


@Component({
  selector: 'app-modal-email',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-email.component.html',
  styleUrl: './modal-email.component.scss'
})
export class ModalEmailComponent extends BaseComponent implements OnInit {

  SEMICOLON: number = 186;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  toEmails = [];
  ccEmails = [];


  emailTemplateList: Dropdown[];
  emailFrom: Dropdown[];
  parentModule: string = "";
  fromEmail: string;
  toEmailDefault: string = "apichathot@gmail.com";
  emailTemplate: string;

  sendEmailForm: FormGroup;
  form: FormGroup;
  result: string;

  titleModalEmail: string;

  subjectEmail: string;

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
  file: File;


  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private dialogRef: MatDialogRef<ModalEmailComponent>,
    private templateService: EmailTemplateService,
    private emailService: ModalEmailService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataIn: any,
  ) {
    super(router, globals);

    this.parentModule = this.dataIn.parentModule;

    Quill.register('modules/imageHandler', ImageHandler);
    Quill.register('modules/videoHandler', VideoHandler);

    templateService.getEmailTemplateByModule({ data: { module: this.parentModule } }).then(result => {
      if (result.status) {
        this.emailTemplate = result.data.templateHtmlCode;
        this.replaceTemplate(this.emailTemplate);
      }

    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });


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

    if (this.dataIn) {
      this.titleModalEmail = this.dataIn.titleModalEmail;
      this.subjectEmail = this.dataIn.subjectEmail;
    }

    this.sendEmailForm = this.formBuilder.group({

      fromEmail: [],
      toEmail: ['apichathot@gmail.com', Validators.required],
      ccEmail: [''],
      subjectEmail: [this.subjectEmail],
      bodyEmail: [this.emailTemplate],
      parentModule: [this.parentModule],
      fileName: ['']

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
      toEmail: this.toEmails,
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

    // this.sendEmail(param);
    this.sendEmailWithAttachedFile();

  }

  sendEmailWithAttachedFile() {
    const msgTitle = 'Sent!';
    const msgText = 'E-mail has been sent successfully.';

    const emailModel: EmailModel = {
      fromEmail: this.sendEmailForm.controls['fromEmail'].value
      , toEmail: this.sendEmailForm.controls['toEmail'].value
      , ccEmail: this.sendEmailForm.controls['ccEmail'].value
      , subjectEmail: this.sendEmailForm.controls['subjectEmail'].value
      , bodyEmail: this.sendEmailForm.controls['bodyEmail'].value
      , parentModule: this.sendEmailForm.controls['parentModule'].value
    };

    this.emailService.sendEmailWithAttachedFile(this.file, emailModel).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const response: ApiResponse<EmailModel> = <ApiResponse<EmailModel>>JSON.parse(<string>event.body);
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
      }
    });
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


  selectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.sendEmailForm.patchValue({
        fileName: this.file.name
      });
    }
  }

  add(event) {
    const index = this.toEmails.findIndex(key => key.keyword === event.value);
    if (index === -1) {
      this.toEmails.push({
        email: event.value
      });
    }

    if (event.input) {
      event.input.value = '';
    }
  }

  remove(keyword: Emails) {
    const index = this.toEmails.findIndex(key => key.email === keyword.email);
    if (index !== -1) {
      this.toEmails.splice(index, 1);
    }
  }


  addCC(event) {
    const index = this.ccEmails.findIndex(key => key.keyword === event.value);
    if (index === -1) {
      this.ccEmails.push({
        email: event.value
      });
    }

    if (event.input) {
      event.input.value = '';
    }
  }

  removeCC(keyword: Emails) {
    const index = this.ccEmails.findIndex(key => key.email === keyword.email);
    if (index !== -1) {
      this.ccEmails.splice(index, 1);
    }
  }

  searchCustomer(action: string) {

    const dialogRef = this.dialog.open(ModalCustomerComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let email = result.email;

        if (action == "TO") {
          this.toEmails.push({
            email: email
          });
        }

        if (action == "CC") {
          this.ccEmails.push({
            email: email
          });
        }

      }
    });
  }
}