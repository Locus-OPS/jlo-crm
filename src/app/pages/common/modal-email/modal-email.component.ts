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
  parentModule: string;
  fromEmail: string;
  toEmail: string;
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

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private dialogRef: MatDialogRef<ModalEmailComponent>,
    //private emailService: EmailService, 
    @Inject(MAT_DIALOG_DATA) public dataIn: any,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType(
      { data: ['EMAIL_TEMPLATE'] }
    ).then(result => {
      this.emailTemplateList = result.data['EMAIL_TEMPLATE'];

      this.emailTemplateList.findIndex(values => {
        if (this.parentModule == values.codeId) {

          this.emailTemplate = values.description;
          this.fromEmail = values.etc1;
          this.subjectEmail = values.etc2;
        }
      });

      // if (this.parentModule == "001") {//001 = for CG
      //   this.replaceTemplateCG(this.emailTemplate);
      // } else if (this.parentModule == "002") {//002 = for egmtDetailAuditStore
      //   this.replaceTemplateEgmtDetailAuditStore(this.emailTemplate);
      // } else if (this.parentModule == "003") {//003 = for egmtTeam
      //   this.replaceTemplateEgmtTeam(this.emailTemplate);
      // } else if (this.parentModule == '004') {//004 = for egmt approve report
      //   this.replaceTemplateEgmtDetailApproveReport(this.emailTemplate)
      // }

    });


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

    this.form = new FormGroup({
      text: new FormControl('<p><strong>Hello</strong> World!</p>')
    });

    this.sendEmailForm = this.formBuilder.group({
      attachmentId: [this.attachmentId],
      fileName: [this.fileName],
      fileDocName: [this.fileDocName],
      documentType: [this.documentType],
      documentTypeDesc: [this.documentTypeDesc],
      fromEmail: [],
      toEmail: ['pornpimol@locus.co.th', Validators.required],
      // toEmail:[this.toEmail],
      ccEmail: [''],
      subjectEmail: [this.subjectEmail],
      // bodyEmail: new FormControl('<p><strong>Hello</strong> World!</p>'),
      bodyEmail: [this.emailTemplate],
      parentId: [this.parentId],
      parentModule: [this.parentModule]
      //parentModule: ['LEGAL_SHARING_POINT']

    });

  }

  public onSelectionChanged(): void {
    this.result = this.form.get('text').value;
  }

  replaceTemplateCG(bodyEmail) {
    this.fileNameList = this.dataIn.emailData.fileNameList;

    bodyEmail = bodyEmail.replace('$caseNo', this.dataIn.emailData.caseNo);
    bodyEmail = bodyEmail.replace('$riskLevel', this.dataIn.emailData.riskLevel);
    bodyEmail = bodyEmail.replace('$subject', this.dataIn.emailData.subject);
    bodyEmail = bodyEmail.replace('$typeOfReport', this.dataIn.emailData.typeOfReport);
    bodyEmail = bodyEmail.replace('$whistleblowerName', this.dataIn.emailData.whistleblowerName);
    bodyEmail = bodyEmail.replace('$orderNo', this.dataIn.emailData.orderNo);
    bodyEmail = bodyEmail.replace('$memberNo', this.dataIn.emailData.memberNo);
    bodyEmail = bodyEmail.replace('$phoneContact', this.dataIn.emailData.phoneContact);
    bodyEmail = bodyEmail.replace('$location', this.dataIn.emailData.location);
    bodyEmail = bodyEmail.replace('$description', this.dataIn.emailData.description);
    bodyEmail = bodyEmail.replace('$dueDate', this.dataIn.emailData.dueDate);
    console.log(this.fromEmail);
    this.sendEmailForm.patchValue({
      fromEmail: this.fromEmail,
      bodyEmail: bodyEmail,
      toEmail: this.dataIn.emailData.toEmail,
      subjectEmail: this.subjectEmail
    });

    /*               
    Dear ALL

    Internal Audit Department received a whistleblowing report through CG Office as follows:

    Case No:$caseNo
    Risk Level:$riskLevel
    Subject:$subject
    Type of Report:$typeOfReport
    Whistleblower:$whistleblowerName
    Order (if any):$orderNo
    Member (if any):$memberNo
    Phone Contact:$phoneContact
    Location:$location
    Description:$description

    Please be supportive to verify the fact, contact customer (if any), find solutions, and respond to CG Office
    within $dueDate


    Thank you for your cooperation in verifying the information.


    Best Regards
    Internal Audit Department
    Mobile phone (090 908 7808)

    CG Office
    Tel:+66 (02) 2 067 9300 Fax: +66(0) 2067 8119
    Email: cgoffice@siammakro.co.th	

  */
  }

  replaceTemplateEgmtDetailAuditStore(bodyEmail) {
    console.log("replaceTemplateEgmtDetailAuditStore");
    var fieldWorkStartDate = "";
    var fieldWorkEndDate = "";
    bodyEmail = bodyEmail.replace('$storeName', this.dataIn.emailData.storeName);
    //   bodyEmail = bodyEmail.replace('$storeNo', this.dataIn.emailData.storeNo);

    if (this.dataIn.emailData.fieldWorkStartDate) {
      fieldWorkStartDate = this.dataIn.emailData.fieldWorkStartDate;
    }

    if (this.dataIn.emailData.fieldWorkEndDate) {
      fieldWorkEndDate = this.dataIn.emailData.fieldWorkEndDate;
    }
    bodyEmail = bodyEmail.replace('$fieldWorkStartDate', fieldWorkStartDate);
    bodyEmail = bodyEmail.replace('$fieldWorkEndDate', fieldWorkEndDate);
    bodyEmail = bodyEmail.replace('$engagementManager', this.dataIn.emailData.engagementManager);
    bodyEmail = bodyEmail.replace('$emailEngagementManager', this.dataIn.emailData.emailEngagementManager);


    var teamMemberName = "";

    var teamMemberList = this.dataIn.emailData.teamMemberList;
    for (var teamMember of teamMemberList) {
      teamMemberName += '<p>' + teamMember.engagementRoleName + ' : ' + teamMember.firstName + ' ' + teamMember.lastName + '</p>';
    }

    bodyEmail = bodyEmail.replace('$teamMember', teamMemberName);

    var uniqueEmail = {};

    teamMemberList.forEach(function (el) {
      if (!uniqueEmail[el.email]) {
        uniqueEmail[el.email] = true;
      }
    });
    // var ccEmail = Object.keys(uniqueEmail);
    // console.log(Object.keys(uniqueEmail));
    var ccEmail = Object.keys(uniqueEmail).map(function (key) {
      return key
    }).join(',');

    this.sendEmailForm.patchValue({
      fromEmail: this.fromEmail,
      bodyEmail: bodyEmail,
      toEmail: this.dataIn.emailData.toEmail,
      ccEmail: ccEmail,
      subjectEmail: this.subjectEmail
    });

    /*               
    Dear Store $storeName,				

    According to audit plan, we would like to inform you that Internal Audit plans to start auditing fieldwork during $fieldWorkStartDate - $fieldWorkEndDate
    We are pleased to ask your co-operation and support  documents and stock taking.
    If you have any queries, please contact Busakorn Rakkanka (brakkank@siammakro.co.th) or $engagementManager($emailEngagementManager).

    Team Member:
    $teamMember

    Best regards,

    Internal Audit Department	
    Siam Makro Public Company Limited
  */
  }

  replaceTemplateEgmtTeam(bodyEmail) {
    console.log("replaceTemplateEgmtTeam");
    bodyEmail = bodyEmail.replace('$engagementCode', this.dataIn.emailData.engagementCode != null ? this.dataIn.emailData.engagementCode : "");
    bodyEmail = bodyEmail.replace('$engagement', this.dataIn.emailData.engagement);
    bodyEmail = bodyEmail.replace('$planStartDate', this.dataIn.emailData.planStartDate);
    bodyEmail = bodyEmail.replace('$planEndDate', this.dataIn.emailData.planEndDate);
    bodyEmail = bodyEmail.replace('$applicationLoginPage', this.dataIn.emailData.applicationLoginPage);

    var teamMemberName = "";
    var teamMemberList = this.dataIn.emailData.teamMemberList;
    console.log("Member List Team begin");
    console.log(teamMemberList);
    console.log("Member List Team end");

    for (var teamMember of teamMemberList) {
      teamMemberName += '<p>' + teamMember.engagementRoleName + ' : ' + teamMember.firstName + ' ' + teamMember.lastName + '</p>';
    }

    bodyEmail = bodyEmail.replace('$teamMember', teamMemberName);

    var uniqueEmail = {};

    teamMemberList.forEach(function (el) {
      if (!uniqueEmail[el.email]) {
        uniqueEmail[el.email] = true;
      }
    });

    // var ccEmail = Object.keys(uniqueEmail);
    // console.log(Object.keys(uniqueEmail));

    var toEmailConcat = Object.keys(uniqueEmail).map(function (key) {
      return key
    }).join(',');

    this.sendEmailForm.patchValue({
      fromEmail: this.fromEmail,
      bodyEmail: bodyEmail,
      toEmail: toEmailConcat,
      ccEmail: "",
      subjectEmail: this.subjectEmail
    });

    /*               
    Dear Internal Audit Team,
	
    You have been assigned to be a part of engagement team.
      
    Engagment No: $engagementCode
    Engagement Name: $engagement
    Period Start: $planStartDate
    Period End: $planEndDate
      
    $teamMember
      
    Please see your assignment in IAMS: $applicationLoginPage
      
    Best regards,
    Internal Audit Management System (IAMS)

  */
  }

  replaceTemplateEgmtDetailApproveReport(bodyEmail) {
    this.fileNameList = this.dataIn.emailData.fileNameList;

    console.log("replaceTemplateEgmtDetailApproveReport");
    bodyEmail = bodyEmail.replaceAll('$storeName', this.dataIn.emailData.storeName != null ? this.dataIn.emailData.storeName : "");
    bodyEmail = bodyEmail.replaceAll('$storeNo', this.dataIn.emailData.storeNo != null ? " ST." + this.dataIn.emailData.storeNo : "");
    bodyEmail = bodyEmail.replace('$fieldWorkStartDate', this.dataIn.emailData.fieldWorkStartDate);
    bodyEmail = bodyEmail.replace('$fieldWorkEndDate', this.dataIn.emailData.fieldWorkEndDate != null ? this.dataIn.emailData.fieldWorkEndDate : "");
    bodyEmail = bodyEmail.replace('$signedOffDate', this.dataIn.emailData.signedOffDate != null ? this.dataIn.emailData.signedOffDate : "");
    bodyEmail = bodyEmail.replace('$engagementManager', this.dataIn.emailData.engagementManager != null ? this.dataIn.emailData.engagementManager : "");
    bodyEmail = bodyEmail.replace('$emailEngagementManager', this.dataIn.emailData.emailEngagementManager != null ? this.dataIn.emailData.emailEngagementManager : "");


    var teamMemberName = "";

    var teamMemberList = this.dataIn.emailData.teamMemberList;
    for (var teamMember of teamMemberList) {
      teamMemberName += '<p>' + teamMember.engagementRoleName + ' : ' + teamMember.firstName + ' ' + teamMember.lastName + '</p>';
    }

    bodyEmail = bodyEmail.replace('$teamMember', teamMemberName);

    var uniqueEmail = {};

    teamMemberList.forEach(function (el) {
      if (!uniqueEmail[el.email]) {
        uniqueEmail[el.email] = true;
      }
    });
    // var ccEmail = Object.keys(uniqueEmail);
    // console.log(Object.keys(uniqueEmail));
    var ccEmail = Object.keys(uniqueEmail).map(function (key) {
      return key
    }).join(',');

    console.log(ccEmail);
    this.sendEmailForm.patchValue({
      fromEmail: this.fromEmail,
      bodyEmail: bodyEmail,
      toEmail: this.dataIn.emailData.toEmail,
      ccEmail: ccEmail,
      subjectEmail: this.subjectEmail,
      attachmentId: this.dataIn.emailData.attId
    });

    /*               
    Dear Store $storeName ST.$storeNo,													
                              	
    Thank you for your kind support and cooperation during our audit visit during $fieldWorkStartDate - $fieldWorkEndDate														
                              	
    We gladly send the audit finding report of Store $storeName ST.$storeNo as attached.														
                              	
    It would be grateful if you would please input management’ s response and action plan in the attached file and send back to IA team within $signedOffDate days.														
                              	
    We really appreciate for your support.														
                              	
    If you have any questions, please do not hesitate to contact: $engagementManager ($emailEngagementManager).														
                              	
    Best regards,																											
    Internal Audit Department														
    Siam Makro Public Company Limited														
  */
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

    if (this.parentModule == "001") {
      this.sendEmailWithMultiAtt(param);
    } else if (this.parentModule == "004") {
      this.onSendEmailWithAprrove(param);
    } else {
      this.sendEmail(param);
    }
  }

  sendEmail(param) {
    const msgTitle = 'Sent!';
    const msgText = 'E-mail has been sent successfully.';

    // this.emailService.sendEmail({
    //   data: param
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

  sendEmailWithMultiAtt(param) {
    const msgTitle = 'Sent!';
    const msgText = 'E-mail has been sent successfully.';

    // this.emailService.sendEmailWithMultiAtt({
    //   data: param
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
