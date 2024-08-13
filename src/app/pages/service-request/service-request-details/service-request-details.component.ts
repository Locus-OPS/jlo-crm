import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CaseactivityComponent } from '../../case/caseactivity/caseactivity.component';
import { Location } from '@angular/common';
import { CaseattComponent } from '../../case/caseatt/caseatt.component';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { ModalEmailComponent } from '../../common/modal-email/modal-email.component';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { AppStore } from 'src/app/shared/app.store';
import { BaseComponent } from 'src/app/shared/base.component';
import ConsultingUtils from 'src/app/shared/consultingStore';
import { Globals } from 'src/app/shared/globals';
import Utils from 'src/app/shared/utils';

import { ServiceRequestModel } from '../../service-request/service-request.model';
import { ServiceRequestService } from '../../service-request/service-request-service';
import { ServiceRequestStore } from '../../service-request/service-request.store';

import { ModalCustomerComponent } from '../../common/modal-customer/modal-customer.component';
import { UserData } from '../../common/modal-user/modal-user';
import { ModalUserComponent } from '../../common/modal-user/modal-user.component';
import { ConsultingService } from '../../consulting/consulting.service';


@Component({
  selector: 'app-service-request-details',
  templateUrl: './service-request-details.component.html',
  styleUrl: './service-request-details.component.scss',
  standalone: true,
  imports: [SharedModule, CaseattComponent, CaseactivityComponent, CreatedByComponent]
})
export class ServiceRequestDetailsComponent extends BaseComponent implements OnInit, OnDestroy {

  selectedTab: number;
  createForm: FormGroup;
  customerForm: FormGroup;
  contactForm: FormGroup;

  contactRelTypeList: Dropdown[];

  divisionList: Dropdown[];
  categoryList: Dropdown[];
  serviceAreaList: Dropdown[];
  typeList: Dropdown[];
  subTypeList: Dropdown[];
  priorityList: Dropdown[];
  srChannelList: Dropdown[];
  srStatusList: Dropdown[];
  titleNameList: Dropdown[];
  priorityListTemp: Dropdown[];

  custParam: Object = {};
  submitted = false;
  isReadOnly = false;
  created = false;

  cusInfo = {
    customerId: '',
    title: '',
    firstName: '',
    lastName: '',
    customerType: '',
    businessName: '',
    phoneNo: '',
    email: '',
  };

  data: UserData;

  srDetailSubscription: Subscription;

  mode: string = '';
  caseSlaId: string = '1';

  titleModalEmail: string = "";
  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private srService: ServiceRequestService,
    private _location: Location,
    private srStore: ServiceRequestStore,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog,
    private tabParam: TabParam,
    private appStore: AppStore,
    private spinner: NgxSpinnerService,
    private consultingService: ConsultingService,
    private translate: TranslateService

  ) {
    super(router, globals);
    this.loadCodebook();

    this.translate.get(['case.email.title']).subscribe(translation => {
      this.titleModalEmail = translation['case.email.title'];
    });

  }

  loadCodebook() {

    this.api.getMultipleCodebookByCodeType(
      { data: ['SR_DIVISION', 'SR_CATEGORY', 'SR_SERVICE_AREA', 'SR_TYPE', 'SR_PRIORITY', 'SR_CHANNEL', 'SR_STATUS', 'TITLE_NAME', 'SR_SUBTYPE', 'SR_CONTACT_RELATION'] }
    ).then(result => {

      this.divisionList = result.data['SR_DIVISION'];
      this.categoryList = result.data['SR_CATEGORY'];
      this.serviceAreaList = result.data['SR_SERVICE_AREA'];
      this.typeList = result.data['SR_TYPE'];
      this.priorityList = result.data['SR_PRIORITY'];
      this.priorityListTemp = result.data['SR_PRIORITY'];
      this.srChannelList = result.data['SR_CHANNEL'];
      this.srStatusList = result.data['SR_STATUS'];
      this.titleNameList = result.data['TITLE_NAME'];
      this.subTypeList = result.data['SR_SUBTYPE'];
      this.contactRelTypeList = result.data['SR_CONTACT_RELATION'];
    });
  }


  ngOnDestroy() {
    console.log("ngOnDestroy");
    this.srDetailSubscription.unsubscribe();
    sessionStorage.removeItem('srNumber');
  }

  ngOnInit() {

    this.createForm = this.formBuilder.group({
      srNumber: [''],
      consultingNumber: [''],
      divisionTypeCode: ['', Validators.required],
      categoryTypeCode: ['', Validators.required],
      type: ['', Validators.required],
      subType: ['', Validators.required],
      subject: [''],
      serviceAreaCode: [''],
      priority: [''],
      channel: [''],
      status: [''],
      owner: [''],
      displayName: [''],
      workNote: [''],
      dslnumber: [''],
      incnumber: [''],
      dslstatus: [''],
      informName: [''],

      detail: [''],
      caseSlaId: [''],

      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: [''],
      dueDate: [''],
      openedDate: [''],
      closedDate: [''],
      customerId: ['']
    });

    this.customerForm = this.formBuilder.group({
      customerId: ['', Validators.required],
      title: [''],
      firstName: [''],
      lastName: [''],
      customerType: [''],
      businessName: [''],
      phoneNo: [''],
      email: [''],
    });


    this.contactForm = this.formBuilder.group({
      contId: [''],
      customerId: ['', Validators.required],
      title: [''],
      firstName: [''],
      lastName: [''],
      relationCd: [''],
      phoneNo: [''],
      email: [''],
    });





    this.create();

    this.srDetailSubscription = this.srStore.getSrDetail().subscribe(detail => {
      console.log("srDetailSubscription");
      console.log(detail);
      if (detail) {
        sessionStorage.setItem('srNumber', detail.srNumber);
        this.updateFormValue(detail);
        console.log("update from value session srNumber" + sessionStorage.getItem('srNumber'));
      } else {
        console.log("resetCustomer")
        this.resetCustomer();
        this.create();
      }
    });


    if (ConsultingUtils.isConsulting()) {

      if (this.tabParam.params.customerId) {
        sessionStorage.removeItem('srNumber');
        this.getCustomerInfo(this.tabParam.params);
        this.srStore.clearSrDetail();
        this.setConsultingCase();
      } else {

        console.log("Session srNumber : " + sessionStorage.getItem('srNumber'));
        if (sessionStorage.getItem('srNumber') != null) {

          console.log("ngOnInit updateSrDetail");

        } else {

          //alert("new from case");
          const contData = JSON.parse(ConsultingUtils.getConsultingData());
          if (contData.customerId != null && contData.customerId != undefined) {

            this.custParam['customerId'] = contData.customerId;
            this.getCustomerInfo(this.custParam);
          }

          this.srStore.clearSrDetail();
          this.setConsultingCase();

        }

      }


    } else {


      if (this.tabParam.params.customerId) {
        sessionStorage.removeItem('srNumber');
        this.getCustomerInfo(this.tabParam.params);
        this.srStore.clearSrDetail();
        //"from customer page"
      } else {
        console.log("195 else sessionStorage.getItem('srNumber') " + sessionStorage.getItem('srNumber'))
        if (sessionStorage.getItem('srNumber')) {

          this.srStore.updateSrDetail(sessionStorage.getItem('srNumber'));
          //"Case edit "
        } else {
          //"clearSrDetail"
          this.srStore.clearSrDetail();
        }
      }
    }


    this.getSlaIdByPriority(this.createForm.value['priority']);

  }


  onCaseCreate() {
    sessionStorage.removeItem('srNumber');
    this.srStore.clearSrDetail();
  }




  setConsultingCase() {
    if (ConsultingUtils.isConsulting()) {
      const contData = JSON.parse(ConsultingUtils.getConsultingData());
      this.createForm.patchValue({ consultingNumber: contData.consultingNumber });
      this.createForm.patchValue({ channel: contData.channelCd });
      //alert(contData.channelCd);
    }

  }


  updateFormValue(detail: ServiceRequestModel) {
    console.log(detail);
    this.created = false;
    this.customerForm.patchValue(detail);
    this.createForm.patchValue(detail);

  }

  backClicked() {
    this.srStore.clearSrDetail();
    this._location.back();
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.createForm.reset();
    this.createForm.patchValue({ status: '01', priority: '04', channel: '01' });


  }

  getSrTypeByCategoryId(categoryId) {
    const data = `SR_TYPE,${categoryId}`;
    this.api.getCodebookByCodeTypeAndParentId({ data: data }).then(result => { this.typeList = result.data; });
  }

  getSrSubTypeByCaseTypeId(caseTypeId) {
    const data = `SR_SUBTYPE,${caseTypeId}`;
    this.api.getCodebookByCodeTypeAndParentId({ data: data }).then(result => { this.subTypeList = result.data; });
  }

  loadCodebookPrioriry(priorityId: String) {

    this.api.getMultipleCodebookByCodeType(
      { data: ['SR_PRIORITY'] }
    ).then(result => {
      this.priorityList = result.data['SR_PRIORITY'];
      this.priorityListTemp = result.data['SR_PRIORITY'];

      this.setPriorityForSlaID(priorityId);
    });
  }

  setPriorityForSlaID(priorityId) {

    this.priorityListTemp = this.priorityList;
    console.log(this.priorityListTemp);

    this.priorityListTemp = this.priorityListTemp.filter(vl => {
      return vl.codeId == priorityId;
    });

    if (this.priorityListTemp.length > 0) {
      this.caseSlaId = this.priorityListTemp[0].etc1;
      this.createForm.patchValue({ caseSlaId: this.caseSlaId });
    } else {
      //Defualt 1
      this.createForm.patchValue({ caseSlaId: this.caseSlaId });
    }
  }

  getSlaIdByPriority(priorityId: String) {

    if (this.priorityListTemp == undefined) {
      this.loadCodebookPrioriry(priorityId);

    } else {
      this.setPriorityForSlaID(priorityId);

    }
  }

  resetForm() {
    console.log("resetForm ");
    this.createForm.reset();
    this.createForm.patchValue({ status: '01', priority: '04', channel: '01' });
    if (sessionStorage.getItem('srNumber')) {
      this.srStore.updateSrDetail(sessionStorage.getItem('srNumber'));
    }
  }

  onSave(event: Event) {
    this.submitted = true;

    if (this.customerForm.invalid) {
      Utils.alertError({
        text: 'Please, Select Customer',
      });
      return;
    }

    if (this.createForm.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.createForm.value
    };
    if (this.created) {
      response = this.srService.createSr({
        data: param
      });
    } else {
      param.createdDate = '';
      param.updatedDate = '';
      param.openedDate = '';
      param.closedDate = '';
      response = this.srService.updateSr({
        data: param
      });
    }
    console.log("data : ", param);
    response.then(result => {
      this.appStore.broadcastNewSr({
        srNumber: result.data.srNumber
        , customerId: this.cusInfo.customerId
      });

      if (result.status) {
        sessionStorage.setItem('srNumber', result.data.srNumber);
        this.srStore.updateSrDetail(sessionStorage.getItem('srNumber'));
        this.created = false;
        this.customerForm.patchValue(result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Service Request has been saved.',
        });
      } else {
        Utils.alertError({
          text: 'Service Request has not been saved.',
        });
      }
    }, () => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  getCustomerInfo(params: object) {
    console.log("param", params);
    let response: Promise<ApiResponse<any>>;
    if (params['customerId'] != null) {
      response = this.srService.getCustomerById({
        data: { customerId: parseInt(params['customerId']) }
      });
    }

    response.then(result => {
      if (result.data) {
        console.log('result.data ', result.data);
        this.cusInfo.customerId = result.data['customerId'];
        this.cusInfo.title = result.data['title'];
        this.cusInfo.firstName = result.data['firstName'];
        this.cusInfo.lastName = result.data['lastName'];
        this.cusInfo.businessName = result.data['businessName'];
        this.cusInfo.customerType = result.data['customerType'];
        this.cusInfo.email = result.data['email'];
        this.cusInfo.phoneNo = result.data['phoneNo'];
        this.customerForm.patchValue(this.cusInfo);
        this.createForm.patchValue(this.cusInfo);
      }
    }, () => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  showOwner() {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue({ owner: result.id, displayName: result.displayName });
      }
    });
  }

  searchCustomer() {
    const dialogRef = this.dialog.open(ModalCustomerComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.custParam['customerId'] = result.customerId;
        this.getCustomerInfo(this.custParam);
        let customerId = result.customerId;
        //Binding Customer into Consulting
        this.selectCustomerConsulting(customerId);
      }
    });
  }

  selectCustomerConsulting(customerId: string) {

    if (ConsultingUtils.isConsulting()) {

      const contData = JSON.parse(ConsultingUtils.getConsultingData());
      const params = {
        data: {
          consultingNumber: contData.consultingNumber,
          customerId: customerId,
          contactId: customerId
        }
      };

      this.consultingService.updateConsultingBindingCustomer(params).then((result: any) => {
        this.spinner.hide("approve_process_spinner");
        if (result.status) {
          console.log("Binding consulting into case")

        } else {



          setTimeout(() => {
            this.spinner.hide("approve_process_spinner");
          }, 1000);


          if (result.message != "") {
            Utils.alertError({
              text: result.message,
            });
          } else {
            Utils.alertError({
              text: "Please try again later.",
            });
          }
        }
      }, (err: any) => {
        Utils.alertError({
          text: err.message,
        });
      }

      );
    } else {
      console.log("No Consulting ")
    }

  }

  resetCustomer() {
    this.customerForm.reset();
    this.createForm.reset();
    this.createForm.patchValue({ status: '01', priority: '04', channel: '01' });
  }

  createContact() {
    this.contactForm.reset();
    console.log(this.customerForm.value);
    this.contactForm.patchValue(this.customerForm.value);
  }

  saveContact() {
    if (this.customerForm.invalid) {

      Utils.alertError({
        text: 'Please, Select Customer',
      });
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    // Keep in session storage




  }

  resetContactForm() {
    this.contactForm.reset();
    this.contactForm.patchValue({ status: '01', priority: '04', channel: '01' });
    this.contactForm.patchValue(this.customerForm.value);
  }


  openModalSendEmail(module: string) {

    let customerName = "";
    if (this.customerForm.value.businessName != null) {
      customerName = this.customerForm.value.businessName;
    } else {
      customerName = this.customerForm.value['firstName'] + ' ' + this.customerForm.value['lastName'];
    }


    const dialogRef = this.dialog.open(ModalEmailComponent, {
      height: '85%',
      width: '80%',
      disableClose: true,
      data: {
        titleModalEmail: this.titleModalEmail,
        parentModule: module,
        customerName: customerName,
        srNumber: this.createForm.value['srNumber'],
        subjectEmail: 'เรื่องที่ให้บริการ ',
        subject: this.createForm.value['subject'],
      }
    });

    // const dialogRef = this.dialog.open(ModalEmailComponent, {
    //   maxWidth: "50%",
    //   width: '1000px',
    //   height: '800px',
    //   disableClose: true,
    //   // data:data,
    //   data: {
    //   }
    // });

    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

    });



  }

}
