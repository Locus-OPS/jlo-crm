import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { CaseService } from '../case.service';
import { Case } from '../case.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Subscription, from } from 'rxjs';
import { CaseStore } from '../case.store';
import { Globals } from 'src/app/shared/globals';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { CustomerService } from 'src/app/pages/customer/customer.service';
import { MemberService } from 'src/app/pages/customer/member-detail/member.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserComponent } from '../../common/modal-user/modal-user.component';
import { UserData } from '../../common/modal-user/modal-user'
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { AppStore } from 'src/app/shared/app.store';
import { ModalCustomerComponent } from '../../common/modal-customer/modal-customer.component';
import ConsultingUtils from 'src/app/shared/consultingStore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultingService } from '../../consulting/consulting.service';



@Component({
  selector: 'app-casedetails',
  templateUrl: './casedetails.component.html',
  styleUrls: ['./casedetails.component.scss']
})

export class CasedetailsComponent extends BaseComponent implements OnInit, OnDestroy {

  selectedTab: number;
  createForm: UntypedFormGroup;
  customerForm: UntypedFormGroup;
  ccntactForm: UntypedFormGroup;

  typeList: Dropdown[];
  subTypeList: Dropdown[];
  priorityList: Dropdown[];
  caseChannelList: Dropdown[];
  caseStatuslList: Dropdown[];
  titleNameList: Dropdown[];
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

  caseDetailSubscription: Subscription;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private caseService: CaseService,
    private _location: Location,
    private caseStore: CaseStore,
    public router: Router,
    public globals: Globals,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private memberService: MemberService,
    public dialog: MatDialog,
    private tabParam: TabParam,
    private appStore: AppStore,
    private spinner: NgxSpinnerService,
    private consultingService : ConsultingService,
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType(
      { data: ['CASE_TYPE', 'CASE_PRIORITY', 'CASE_CHANNEL', 'CASE_STATUS', 'TITLE_NAME', 'CASE_SUBTYPE'] }
    ).then(result => {
      this.typeList = result.data['CASE_TYPE'];
      this.priorityList = result.data['CASE_PRIORITY'];
      this.caseChannelList = result.data['CASE_CHANNEL'];
      this.caseStatuslList = result.data['CASE_STATUS'];
      this.titleNameList = result.data['TITLE_NAME'];
      this.subTypeList = result.data['CASE_SUBTYPE'];
    });

  }

  ngOnDestroy() {
    this.caseDetailSubscription.unsubscribe();
    sessionStorage.removeItem('caseNumber');
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      caseNumber: [''],
      consultingNumber:[''],
      type: ['', Validators.required],
      subType: ['', Validators.required],
      subject: ['', Validators.required],
      detail: ['', Validators.required],
      priority: ['', Validators.required],
      channel: ['', Validators.required],
      status: ['', Validators.required],
      owner: ['', Validators.required],
      displayName: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
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

    this.create();

    if (this.tabParam.params.customerId) {
      sessionStorage.removeItem('caseNumber');
      this.getCustomerInfo(this.tabParam.params);
      this.caseStore.clearCaseDetail();
    } else {
      if (sessionStorage.getItem('caseNumber')) {
        this.caseStore.updateCaseDetail(sessionStorage.getItem('caseNumber'));
      }
      else {
        this.caseStore.clearCaseDetail();
      }
      console.log('sessionStorage.getItem', sessionStorage.getItem('caseNumber'));
      // this.route.params.subscribe(params => {
      //   if (Object.entries(params).length != 0 && params.constructor === Object) {
      //     this.getCustomerInfo(params);
      //   }
      // });
    }

    this.caseDetailSubscription = this.caseStore.getCaseDetail().subscribe(detail => {
      if (detail) {
        sessionStorage.setItem('caseNumber', detail.caseNumber);
        this.updateFormValue(detail);
      }
      else {
        this.resetCustomer();
        this.create();
      }
    });

  }

 setConsultingCase(){
  if(ConsultingUtils.getConsultingData() != null && ConsultingUtils.getConsultingData() != undefined){
    const contData = JSON.parse(ConsultingUtils.getConsultingData());  
    this.createForm.patchValue({ consultingNumber:contData.consultingNumber });    
  }

 }


  updateFormValue(detail: Case) {
    this.created = false;
    this.customerForm.patchValue(detail);
    this.createForm.patchValue(detail);
  }

  backClicked() {
    this.caseStore.clearCaseDetail();
    this._location.back();
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.createForm.reset();
    this.createForm.patchValue({ status: '01', priority: '04', channel: '01' });
    this.setConsultingCase();

  }

  getCaseDetailsTypeId(caseTypeId) {
    const data = `CASE_SUBTYPE,${caseTypeId}`;
    this.api.getCodebookByCodeTypeAndParentId({ data: data }).then(result => { this.subTypeList = result.data; });
  }

  resetForm() {
    this.createForm.reset();
    this.createForm.patchValue({ status: '01', priority: '04', channel: '01' });
    if (sessionStorage.getItem('caseNumber')) {
      this.caseStore.updateCaseDetail(sessionStorage.getItem('caseNumber'));
    }
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Case has been created.!' : 'Case has been updated.';

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
      response = this.caseService.createCase({
        data: param
      });
    } else {
      param.createdDate = '';
      param.updatedDate = '';
      param.openedDate = '';
      param.closedDate = '';
      response = this.caseService.updateCase({
        data: param
      });
    }
    console.log("data : ", param);
    response.then(result => {
      this.appStore.broadcastNewCase({
        caseNumber: result.data.caseNumber
        , customerId: this.cusInfo.customerId
      });
      if (result.status) {
        sessionStorage.setItem('caseNumber', result.data.caseNumber);
        this.caseStore.updateCaseDetail(sessionStorage.getItem('caseNumber'));
        this.created = false;
        this.customerForm.patchValue(result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Case has been saved.',
        });
      } else {
        Utils.alertError({
          text: 'Case has not been saved.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  getCustomerInfo(params: object) {
    console.log("param", params);
    let response: Promise<ApiResponse<any>>;
    if (params['customerId'] != null) {
      response = this.caseService.getCustomerById({
        data: { customerId: parseInt(params['customerId']) }
      });
    }
    else if (params['memberId'] != null) {
      response = this.caseService.getMemberById({
        data: { memberId: parseInt(params['memberId']) }
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
    }, error => {
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

  selectCustomerConsulting(customerId:string){
     
    if(ConsultingUtils.getConsultingData() != null){
     
      const contData = JSON.parse(ConsultingUtils.getConsultingData()) ; 
      const params = {
        data:{
          consultingNumber:contData.consultingNumber,
          customerId : customerId  ,
          contactId : customerId 
        }
      };

      this.consultingService.updateConsultingBindingCustomer(params).then((result: any) => {      
      this.spinner.hide("approve_process_spinner");             
        if (result.status) {         
          console.log("Binding consulting into case")

        }else{
         
         

          setTimeout(() => {
            this.spinner.hide("approve_process_spinner");
          }, 1000);


          if(result.message!=""){
            Utils.alertError({
              text: result.message,
            });
          }else{
            Utils.alertError({
              text: "Please try again later.",
            });
          }
        }
      },(err: any) => {
        Utils.alertError({
          text: err.message,
        });
      }

    );
    }else{
        console.log("No Consulting ")
    }   
    
  }
  
  resetCustomer() {
    this.customerForm.reset();
    this.createForm.reset();
    this.createForm.patchValue({ status: '01', priority: '04', channel: '01' });
  }

}
