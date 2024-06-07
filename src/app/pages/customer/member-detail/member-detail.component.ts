import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MemberService } from './member.service';
import { ActivatedRoute, Router } from '@angular/router';
import Utils from 'src/app/shared/utils';
import { CustomerAddressData } from '../customer-address-data';
import { TableControl } from 'src/app/shared/table-control';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { MemberCardData } from './member-card-data';
import { ChangeLog } from 'src/app/model/change-log.model';
import { MemberAttData } from './member-att-data';
import { ApiResponse } from 'src/app/model/api-response.model';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Case } from '../../case/case.model';
import { CaseStore } from '../../case/case.store';
import { TabParam, TabManageService } from 'src/app/layouts/admin/tab-manage.service';
import { ReIssuesCardComponent } from './re-issues-card/re-issues-card.component';
import { MatDialog } from '@angular/material/dialog';
import { BlockCardComponent } from './block-card/block-card.component';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/shared/app.store';
import { TransactionData } from '../../loyalty/transaction/transaction-data';
import { ShowMoreComponent } from '../../loyalty/transaction/show-more/show-more.component';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TransactionService } from '../../loyalty/transaction/transaction.service';
import { MemberRedeemService } from '../member-redeem/member-redeem.service';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  THAI_NATIONALITY: string = "37";
  THAI_COUNTRY_CODE: string = "66";

  newCaseSubscription: Subscription;
  redeemSubscription: Subscription;

  servicePath:string;

  memberForm:UntypedFormGroup;
  cardForm:UntypedFormGroup;
  addressForm:UntypedFormGroup;
  attForm:UntypedFormGroup;
  caseForm:UntypedFormGroup;
  transactionForm:UntypedFormGroup;

  /* card table */
  cardSelectedRow: MemberCardData;
  cardDS:MemberCardData[];
  cardColumn:string[]=['primary','memberCardNo','cardStatus','cardTierId','cardActiveDate','cardExpiryDate'];
  cardTableControl: TableControl = new TableControl(() => { this.searchCard() });

  /* address table */
  addrSelectedRow: CustomerAddressData;
  addressDS:CustomerAddressData[];
  addressColumn:string[]=['primary','addressType','address','actionDelAdd'];
  addrTableControl: TableControl = new TableControl(() => { this.searchAddress() });
  deleted = false;

  /* attachment table */
  attSelectedRow: MemberAttData;
  attDS: MemberAttData[];
  attColumn: string[] = ['memberAttId', 'title','fileName', 'createdBy', 'updatedBy', 'action'];
  attTableControl: TableControl = new TableControl(() => { this.searchAtt() });
  file: File;

  /* Case table */
  caseSelectedRow: Case;
  caseDS: Case[];
  caseColumn: string[] = ['caseNumber', 'typeName', 'openedDate','closedDate', 'subTypeName', 'priorityName','action'];
  caseTableControl: TableControl = new TableControl(() => { this.searchCase() });

  /* Transaction */
  transactionSelectedRow: TransactionData;
  transactionDS: TransactionData;
  transactionColumns: string[] = ['txnId', 'createdDate', 'program', 'cardNumber', 'txnType', 'txnSubType', 'txnStatus', 'product', 'processedDate', 'channel', 'storeShopId', 'receiptId', 'receiptDate'];
  transactionTableControl: TableControl = new TableControl(() => { this.searchTransaction() });
  canCancelled:boolean;
  /* change log table */
  chSelectedRow: ChangeLog;
  changeLogDS:ChangeLog[];
  changeLogColumn:string[]=['changedBy','changedDetail','changedDate'];
  changeLogTableControl: TableControl = new TableControl(() => { this.searchChangeLog() });

  titleNameList=[];
  nationalityList=[];
  occupationList=[];
  businessTypeList=[];
  genderList=[];
  maritalList=[];
  sourceChannelList=[];
  phonePrefixList=[];
  regisStoreList=[{
    codeId:"000",
    codeName:"Head Office"
  }];
  countryList=[];
  addressTypeList=[];
  customerStatusList=[];
  provinceList=[];
  districtList=[];
  subDistrictList=[];
  postCodeList=[];
  cardStatusList=[];
  promotionCalculateRuleList=[];
  programList: Dropdown[];
  txnTypeList: Dropdown[];
  txnStatusList: Dropdown[];
  txnChannelList: Dropdown[];
  txnSubTypeList: Dropdown[];
  constructor(
    private tabManageService:TabManageService,
    private memberRedeemService: MemberRedeemService,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private customerService : CustomerService,
    private memberService:MemberService,
    private caseStore:CaseStore,
    private el:ElementRef,
    private route: ActivatedRoute,
    public router:Router,
    public globals:Globals,
    public tabParam:TabParam,
    private dialog:MatDialog,
    private appStore: AppStore,
    private txnApi: TransactionService
  ) {
    super(router,globals);
    this.api.getMultipleCodebookByCodeType({
      data: ['TXN_TYPE','TXN_STATUS','TXN_CHANNEL','TXN_SUB_TYPE','GENDER','MARITAL_STATUS','OCCUPATION','TITLE_NAME','NATIONALITY','SOURCE_CHANNEL','PHONE_PREFIX','COUNTRY','ADDRESS_TYPE','CUSTOMER_STATUS','CARD_STATUS','BUSINESS_TYPE']
    }).then(
      result => {
        this.txnTypeList = result.data['TXN_TYPE'];
        this.txnStatusList = result.data['TXN_STATUS'];
        this.txnChannelList = result.data['TXN_CHANNEL'];
        this.txnSubTypeList = result.data['TXN_SUB_TYPE'];
        this.genderList = result.data['GENDER'];
        this.maritalList = result.data['MARITAL_STATUS'];
        this.occupationList = result.data['OCCUPATION'];
        this.titleNameList = result.data['TITLE_NAME'];
        this.nationalityList = result.data['NATIONALITY'];
        this.sourceChannelList = result.data['SOURCE_CHANNEL'];
        this.phonePrefixList = result.data['PHONE_PREFIX'];
        this.countryList = result.data['COUNTRY'];
        this.addressTypeList = result.data['ADDRESS_TYPE'];
        this.customerStatusList = result.data['CUSTOMER_STATUS'];
        this.cardStatusList = result.data['CARD_STATUS'];
        this.businessTypeList = result.data['BUSINESS_TYPE'];
      }
    );
    api.getProgram().then(result => { this.programList = result.data; });
    this.servicePath = environment.endpoint;

    // Listen from member redeem submission.
    // If there is a submit of this member redeem, find his new member point.
    this.redeemSubscription = this.memberRedeemService.getMemberRedeemSubmissionObservable().subscribe(redeemMemberId => {
      if (redeemMemberId) {
        let memberId = this.memberForm.controls['memberId'].value;
        if (redeemMemberId == memberId) {
          this.reloadPoint();
          this.searchTransaction();
        }
      }
    });
  }

  ngOnInit() {
    this.memberForm = this.formBuilder.group({
      memberCardNo:[''],
      cardTierId:[''],
      tierName:new UntypedFormControl({value: '', disabled: true}),
      cardStatus:new UntypedFormControl({value: '', disabled: true}),
      cardActiveDate:new UntypedFormControl({value: '', disabled: true}),
      cardExpiryDate:new UntypedFormControl({value: '', disabled: true}),
      memberId:[''],
      customerId:[''],
      // customerType:[true],
      memberType:[''],
      customerStatus:['1'],
      title:[''],
      firstName:[''],
      lastName:[''],
      nationality:[this.THAI_NATIONALITY],
      citizenId:[''],
      previousCitizenId:[''],
      passportNo:[''],
      previousPassportNo:[''],
      birthDate:[''],
      gender:[''],
      maritalStatus:[''],
      occupation:[''],
      businessName:[''],
      taxId:[''],
      businessType:[''],
      phoneArea:[''],
      phoneNo:[''],
      email:[''],
      registrationChannel:new UntypedFormControl({value: '', disabled: true}),
      registrationStore:new UntypedFormControl({value: '', disabled: true}),
      remark:[''],
      createdBy:[''],
      createdDate:[''],
      updatedBy:[''],
      updatedDate:[''],
      programId:[''],
      programName:new UntypedFormControl({value: '', disabled: true}),
      currentPoint:[''],
      pointExpireThisYear:[''],
      lastCalculatedDate:new UntypedFormControl({value: '', disabled: true}),
    });

    this.cardForm = this.formBuilder.group({
      memberCardNo:[''],
      primaryYn:[],
      primary:[],
      cardType:[''],
      cardTierId:[''],
      cardExpiryDate:[''],
      cardStatus:[''],
      cardIssueDate:[''],
      cardActiveDate:[''],
      cardInactiveDate:[''],
      cardLastBlockDate:[''],
      reIssueReason:[''],
      reIssueCardNo:[''],
      createdBy:new UntypedFormControl({value: '', disabled: true}),
      createdDate:new UntypedFormControl({value: '', disabled: true}),
      updatedBy:new UntypedFormControl({value: '', disabled: true}),
      updatedDate:new UntypedFormControl({value: '', disabled: true}),
    });

    this.addressForm = this.formBuilder.group({
      addressId:[],
      memberId:[],
      primary:[''],
      previousPrimaryYn: [''],
      addressType:[''],
      address:[''],
      postCode:[''],
      subDistrict:[''],
      district:[''],
      province:[''],
      country:[''],
      createdBy:new UntypedFormControl({value: '', disabled: true}),
      createdDate:new UntypedFormControl({value: '', disabled: true}),
      updatedBy:new UntypedFormControl({value: '', disabled: true}),
      updatedDate:new UntypedFormControl({value: '', disabled: true}),
    });

    this.attForm = this.formBuilder.group({
      memberAttId:[],
      memberId:[],
      attId:[],
      fileName:new UntypedFormControl({value: '', disabled: true}),
      filePath:new UntypedFormControl({value: '', disabled: true}),
      title: [''],
      descp:[''],
      createdBy: new UntypedFormControl({value: '', disabled: true}),
      createdDate:new UntypedFormControl({value: '', disabled: true}),
      updatedBy:new UntypedFormControl({value: '', disabled: true}),
      updatedDate:new UntypedFormControl({value: '', disabled: true}),
    });

    this.caseForm = this.formBuilder.group({
      caseNumber: [''],
      typeName:[''],
      subTypeName:[''],
      priorityName:[''],
      subject: [''],
      detail: [''],
      channelName: [''],
      statusName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      openedDateDate: [''],
      closedDateDate: [''],
      customerId: [''],
      displayName: [''],
    });

    this.transactionForm = this.formBuilder.group({
      programId: [''],
      program: [''],
      cardNumber: [''],
      memberName: [''],

      requestPoint: [''],
      pointBefore: [''],
      earnPoint: [''],
      balancePoint: [''],

      txnId: [''],
      txnTypeId: [''],
      txnSubTypeId: [''],
      txnStatusId: [''],
      channelId: [''],
      cancelledTxnId: [''],
      processedDate: [''],
      processedDtl: [''],

      receiptId: [''],
      receiptDate: [''],
      storeShopId: [''],
      storeShopType: [''],
      amount: [''],
      quantity: [''],
      product: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    if(this.tabParam.params['memberId']!=null){
      this.memberService.getMemberById({data:{memberId:this.tabParam.params['memberId']}})
      .then(result => {
        this.memberForm.controls['memberType'].disable();
        this.memberForm.patchValue(result.data);
        this.memberForm.patchValue({ 'previousCitizenId':  this.memberForm.value['citizenId']});
        this.memberForm.patchValue({ 'previousPassportNo':  this.memberForm.value['passportNo']});
        Utils.setBirthDatePicker(this.memberForm);
        this.memberForm.patchValue(result.data.memberCardNoData);
        this.memberForm.patchValue({ 'updatedBy':  result.data.updatedBy});
        this.memberForm.patchValue({ 'updatedDate':  result.data.updatedDate});

        this.changeMemberType(this.memberForm.controls['memberType'].value);

        if(result.data.memberPointData){
          this.memberForm.patchValue(result.data.memberPointData);
        }
        this.searchAddress();
        this.searchCard();
        this.searchAtt();
        this.searchCase();
        this.searchTransaction();
        this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.member', { name: result.data.firstName || result.data.businessName });
      }, error => {
        Utils.alertError({
          text: 'Please try again later.',
        });
        this.router.navigate(["/customer"]);
      });
    }else{
      this.router.navigate(["/customer"]);
    }

    this.newCaseSubscription = this.appStore.observeNewCase().subscribe(newCase => {
      if (newCase.customerId === this.memberForm.controls['customerId'].value) {
        this.searchCase();
      }
    });
  }

  ngOnDestroy() {
    this.newCaseSubscription.unsubscribe();
  }

  changeMemberType(val){
    if(val){
      this.memberForm.controls['firstName'].setValidators([Validators.required, Validators.maxLength(255)]);
      this.memberForm.controls['firstName'].updateValueAndValidity();
      this.memberForm.controls['lastName'].setValidators([Validators.required, Validators.maxLength(255)]);
      this.memberForm.controls['lastName'].updateValueAndValidity();
      // this.memberForm.controls['citizenId'].setValidators([Validators.required, Validators.maxLength(13)]);
      // this.memberForm.controls['citizenId'].updateValueAndValidity();
      this.onChangeNationality(this.memberForm.controls['nationality'].value);
      this.memberForm.controls['businessName'].clearValidators();
      this.memberForm.controls['businessName'].updateValueAndValidity();
    }else{
      this.memberForm.controls['firstName'].clearValidators();
      this.memberForm.controls['firstName'].updateValueAndValidity();
      this.memberForm.controls['lastName'].clearValidators();
      this.memberForm.controls['lastName'].updateValueAndValidity();
      this.memberForm.controls['citizenId'].clearValidators();
      this.memberForm.controls['citizenId'].updateValueAndValidity();
      this.memberForm.controls['businessName'].setValidators([Validators.required, Validators.maxLength(255)]);
      this.memberForm.controls['businessName'].updateValueAndValidity();
    }
  }

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------- Member ---------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  
  
  /**
   * Validate mandatory fields before save member.
   * If this mandatory validation is passed, it will verify citizen id, verify passport no., and then save member.
   */
  onSave() {
    if(this.memberForm.controls['memberType'].value && this.THAI_NATIONALITY == this.memberForm.controls['nationality'].value){
      this.memberForm.controls['citizenId'].setValidators([Validators.required, Validators.maxLength(13)]);
      this.memberForm.controls['citizenId'].updateValueAndValidity();
    }else{
      this.memberForm.controls['citizenId'].clearValidators();
      this.memberForm.controls['citizenId'].updateValueAndValidity();
    }
    if (this.memberForm.invalid) {
      console.log("invalid memberForm");
      Object.keys(this.memberForm.controls).forEach(element => {
        this.memberForm.controls[element].markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.verifyCitizenId();
  }

  /**
   * Validate citizen id by check format and verify duplicate value.
   */
  verifyCitizenId() {
    let previousCitizenId = this.memberForm.value['previousCitizenId'];
    let citizenId = this.memberForm.controls['citizenId'].value;

    // Validate citizen id value.
    if (citizenId) {
      if (!Utils.isValidCitizenId(citizenId)) {
        return;
      }
    }
    
    if (!citizenId || previousCitizenId == citizenId) {
      this.verifyPassportNo();
    } else {
      const param = {
        citizenId : citizenId
      };
      this.customerService.getCustomerByCitizenIdOrPassportNo({
        data: param
      }).then(result => {
        if (result.status) {
          if (result.data.length == 0) {
            this.verifyPassportNo();
          } else {
            Utils.alertError({
              text: 'Cannot save this customer becuse citizen id ' + citizenId + " is existed.",
            });
          }
        } else {
          Utils.alertError({
            text: 'Please, try again later',
          });
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later',
        });
      });
    }
  }

  /**
   * Verify duplicate of passport no. value.
   */
  verifyPassportNo() {
    let previousPassportNo = this.memberForm.value['previousPassportNo'];
    let passportNo = this.memberForm.controls['passportNo'].value;
    
    if (!passportNo || previousPassportNo == passportNo) {
      this.saveMember();
    } else {
      const param = {
        passportNo : passportNo
      };
      this.customerService.getCustomerByCitizenIdOrPassportNo({
        data: param
      }).then(result => {
        if (result.status) {
          if (result.data.length == 0) {
            this.saveMember();
          } else {
            Utils.alertError({
              text: 'Cannot save this customer becuse passport no ' + passportNo + " is existed.",
            });
          }
        } else {
          Utils.alertError({
            text: 'Please, try again later',
          });
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later',
        });
      });
    }
  }

  saveMember() {
    const param = {
      ...this.memberForm.value
      , birthDate: Utils.getDateString(this.memberForm.value['birthDate'])
    };

    this.memberService.saveMember({
      data: param
    }).then(result => {
      if (result.status) {
        this.memberForm.patchValue(result.data);
        this.memberForm.patchValue({ 'previousCitizenId':  this.memberForm.value['citizenId']});
        this.memberForm.patchValue({ 'previousPassportNo':  this.memberForm.value['passportNo']});

        Utils.setBirthDatePicker(this.memberForm);
        Utils.alertSuccess({
          title: "Updated!",
          text: "Member has been updated.",
        });
        this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.member', { name: result.data.firstName || result.data.businessName });
      }else{
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  reloadPoint() {
    let param = {
      memberId: this.memberForm.controls['memberId'].value,
      programId: this.memberForm.controls['programId'].value
    }

    this.memberService.getMemberPoint({data: param})
    .then(result => {
      this.memberForm.patchValue(result.data);
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------- Address --------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchAddress() {
    this.memberService.getMemberAddressList({
      pageSize: this.addrTableControl.pageSize,
      pageNo: this.addrTableControl.pageNo,
      data: { memberId:this.memberForm.controls['memberId'].value, sortColumn: this.addrTableControl.sortColumn, sortDirection: this.addrTableControl.sortDirection }
    }).then(result => {
      this.addressDS = result.data;
      this.addrTableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  selectAddress(row){
    this.addrSelectedRow = row;
    this.addressForm.patchValue(row);
    this.addressForm.patchValue({primary:row.primaryYn=="Y"});
    this.addressForm.patchValue({ previousPrimaryYn:  this.addressForm.value['primary']});
    this.setComboAddress(row.subDistrict);
  }

  addressAdd(){
    this.addrSelectedRow = {};
    this.addressForm.reset();
    this.addressForm.patchValue({memberId:this.memberForm.value.memberId});
    if(this.addressDS==null){
      this.addressForm.patchValue({primary:true,addressType:'02',country: this.THAI_COUNTRY_CODE,previousPrimaryYn:  false});
    }else{
      this.addressForm.patchValue({country: this.THAI_COUNTRY_CODE,previousPrimaryYn:  false});
    }
    setTimeout(() => {
      document.querySelector("#divAddressEditMode").scrollIntoView(true);
    }, 300);
    this.changeCountry();
  }

  onCancelAddress(){
    this.addrSelectedRow=null;
    this.addressForm.reset();
  }
  changeCountry(){
    this.addressForm.patchValue({province:null,district:null,subDistrict:null,postCode:''});
    if(this.addressForm.controls['country'].value == this.THAI_COUNTRY_CODE){
      this.addressForm.controls['province'].setValidators([Validators.required]);
      this.addressForm.controls['province'].updateValueAndValidity();
      this.addressForm.controls['district'].setValidators([Validators.required]);
      this.addressForm.controls['district'].updateValueAndValidity();
      this.addressForm.controls['subDistrict'].setValidators([Validators.required]);
      this.addressForm.controls['subDistrict'].updateValueAndValidity();
      this.addressForm.controls['postCode'].setValidators([Validators.required]);
      this.addressForm.controls['postCode'].updateValueAndValidity();
    }else{
      this.addressForm.controls['province'].clearValidators();
      this.addressForm.controls['province'].updateValueAndValidity();
      this.addressForm.controls['district'].clearValidators();
      this.addressForm.controls['district'].updateValueAndValidity();
      this.addressForm.controls['subDistrict'].clearValidators();
      this.addressForm.controls['subDistrict'].updateValueAndValidity();
      this.addressForm.controls['postCode'].clearValidators();
      this.addressForm.controls['postCode'].updateValueAndValidity();
      this.provinceList = [];
      this.districtList = [];
      this.subDistrictList = [];
      this.postCodeList = [];
    }
    this.api.getProvince({data:this.addressForm.controls['country'].value}).then(
      result => {
        this.provinceList = result.data;
        this.districtList = [];
        this.subDistrictList = [];
        this.postCodeList = [];
      }
    );
  }

  setComboAddress(subDistrict){
    if(subDistrict!=null){
      this.api.getProvince({data:this.addressForm.controls['country'].value}).then(
        result => {
          this.provinceList = result.data;
          this.api.getDistrict({data:subDistrict.substring(0,2)}).then(
            result => {
              this.districtList = result.data;
              this.api.getSubDistrict({data:subDistrict.substring(0,4)}).then(
                result => {
                  this.subDistrictList = result.data;
                  this.addressForm.patchValue({province:subDistrict.substring(0,2),district:subDistrict.substring(0,4),subDistrict:subDistrict});
                }
              );
            }
          );
        }
      );
    }else{
      this.changeCountry();
    }
  }

  changeProvince(){
    this.api.getDistrict({data:this.addressForm.controls['province'].value}).then(
      result => {
        this.districtList = result.data;
        this.subDistrictList = [];
        this.postCodeList = [];
      }
    );
  }

  changeDistrict(){
    this.api.getSubDistrict({data:this.addressForm.controls['district'].value}).then(
      result => {
        this.subDistrictList = result.data;
        this.postCodeList = [];
      }
    );
  }

  changeSubDistrict(){
    this.api.getPostCode({data:this.addressForm.controls['subDistrict'].value}).then(
      result => {
        this.postCodeList = result.data;
        if(result.data.length==1){
          this.addressForm.patchValue({postCode:this.postCodeList[0].codeId});
        }
      }
    );
  }

  keypressPostCode(){
    if(this.addressForm.controls['postCode'].value.length==5){
      this.api.getPostCodeDetail({data:this.addressForm.controls['postCode'].value}).then(
        result => {
          this.postCodeList = result.data;
        }
      );
    }
  }
  selectPostCode(subDistrict){
    if(this.addressForm.controls['country'].value != this.THAI_COUNTRY_CODE){
      return false;
    }

    if(subDistrict!=this.addressForm.controls['subDistrict'].value){
      this.setComboAddress(subDistrict);
    }
  }

  onSaveAddress(e) {
    // const param = {
    //   ...this.addressForm.value,
    //   primaryYn: Utils.convertToYN(this.addressForm.value['primary']),
    // };

   if (this.addressForm.invalid) {
      console.log("invalid addressForm");
      Object.keys(this.addressForm.controls).forEach(element => {
        this.addressForm.controls[element].markAsTouched({ onlySelf: true });
      });
      return;
    }

    let primaryYn = this.addressForm.controls['primary'].value;
    let previousPrimaryYn = this.addressForm.controls['previousPrimaryYn'].value;

    if (primaryYn && !previousPrimaryYn) {
      this.memberService.getMemberAddressPrimary({
        data: {
          memberId: this.memberForm.controls['memberId'].value
        }
      }).then(result => {
        if (result.data) {
          let fullAddress = result.data.fullAddress;
          Utils.confirm("Warning", "Save this address as a primary will remove primary flag from \"" + fullAddress + "\" , do you want to save this address?", "Save Address").then(confirm => {
            if (confirm.value) {
              this.saveAddress();
            }
          });
        } else {
          this.saveAddress();
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later',
        });
      });
    } else {
      this.saveAddress();
    }
  }

  saveAddress() {
    const param = {
      ...this.addressForm.value,
      primaryYn: Utils.convertToYN(this.addressForm.value['primary']),
    };

    const msgTitle = this.addressForm.value.addressId == null ? 'Created!' : 'Updated!';
    const msgText = this.addressForm.value.addressId == null ? 'Address has been created.!' : 'Address has been updated.';

    this.memberService.saveMemberAddress({
      data: param
    }).then(result => {
      if (result.status) {
        // Utils.assign(this.addrSelectedRow, result.data);
        this.addressForm.patchValue(result.data);

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        this.searchAddress();
        this.addrSelectedRow = null;
        this.addressForm.reset();
      } else {
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  onDeleteMemberAddress(element: CustomerAddressData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.memberService.deleteMemberAddress({
          data: {
            addressId: element.addressId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Customer Address', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.searchAddress();
        }, error => {
          Utils.showError(null, error);
        });
      }
    });
  }

  /*
  onSaveAddress(){
    const param = {
      ...this.addressForm.value,
      primaryYn:(this.addressForm.controls['primary'].value?"Y":"N")
    };
    if (this.addressForm.invalid) {
      console.log("invalid");
      Object.keys(this.addressForm.controls).forEach(element => {
        this.addressForm.controls[element].markAsTouched({ onlySelf: true });
      });
      return;
    }

    const msgTitle = this.addressForm.value.addressId==null ? 'Created!' : 'Updated!';
    const msgText = this.addressForm.value.addressId==null ? 'Address has been created.!' : 'Address has been updated.';

    this.memberService.saveMemberAddress({
      data: param
    }).then(result => {
      console.log(result);
      if (result.status) {
        Utils.assign(this.addrSelectedRow, result.data);
        this.addressForm.patchValue(result.data);

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        this.searchAddress();
      }else{
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
    }, error => {
      console.log("error");
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }
  */

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*---------------------------------------------------------- Card --------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchCard(){
    this.memberService.getMemberCardList({
      pageSize: this.cardTableControl.pageSize,
      pageNo: this.cardTableControl.pageNo,
      data: { memberId:this.memberForm.controls['memberId'].value, sortColumn: this.cardTableControl.sortColumn, sortDirection: this.cardTableControl.sortDirection }
    }).then(result => {
      this.cardDS = result.data;
      this.cardTableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  selectCard(row){
    this.cardSelectedRow = row;
    this.cardForm.patchValue(row);
    this.cardForm.patchValue({primary:row.primaryYn=="Y"});
    this.cardForm.disable();
  }

  onCancelCard(){
    this.cardSelectedRow=null;
    this.cardForm.reset();
  }

  reissueCard(){
    let membercard:MemberCardData = {
      memberId:this.memberForm.controls['memberId'].value,
      programId:this.memberForm.controls['programId'].value,
      programName:this.memberForm.controls['programName'].value,
      memberCardNo:this.memberForm.controls['memberCardNo'].value,
      cardTierId:this.memberForm.controls['cardTierId'].value
    };
    const dialogRef = this.dialog.open(ReIssuesCardComponent, {
      width: '400px',
      data: membercard,
      panelClass: 'my-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.memberForm.patchValue({memberCardNo:result.memberCardNo,cardStatus:'01',cardTierId:result.cardTierId,tierName:result.tierName});
        this.searchCard();
      }
    });
  }

  blockCard(){
    let membercard:MemberCardData = {
      memberId:this.memberForm.controls['memberId'].value,
      programId:this.memberForm.controls['programId'].value,
      programName:this.memberForm.controls['programName'].value,
      memberCardNo:this.memberForm.controls['memberCardNo'].value,
      cardTierId:this.memberForm.controls['cardTierId'].value
    };
    const dialogRef = this.dialog.open(BlockCardComponent, {
      width: '400px',
      data: membercard,
      panelClass: 'my-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.memberForm.patchValue({cardStatus:'04'});
        this.searchCard();
      }
    });
  }

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------- Attachment -----------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchAtt(){
    this.memberService.getMemberAttachmentList({
      pageSize: this.attTableControl.pageSize,
      pageNo: this.attTableControl.pageNo,
      data: { memberId:this.memberForm.controls['memberId'].value, sortColumn: this.addrTableControl.sortColumn, sortDirection: this.addrTableControl.sortDirection }
    }).then(result => {
      this.attDS = result.data;
      this.attTableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSelectAttRow(row){
    this.attSelectedRow = row;
    this.attForm.patchValue(row);
  }

  onAttCreate(){
    this.attSelectedRow = {};
    this.file = null;
    this.attForm.reset();
    this.attForm.patchValue({memberId:this.memberForm.controls['memberId'].value});
  }

  selectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.attForm.patchValue({
        fileName: this.file.name
      });
    }
  }

  onAttCancel(){
    this.attSelectedRow = null;
    this.attForm.reset();
  }

  onAttDelete(row){
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.memberService.deleteMemberAttachment({data:row})
        .then(result => {
          this.searchAtt();
        }, error => {
          Utils.alertError({
            text: 'Please try again later.',
          });
        });
      }
    });
  }

  onAttSave(){
    if (this.attForm.invalid) {
      return;
    }
    const param = {
      ...this.attForm.value
    };

    const msgTitle = this.attForm.controls['memberAttId'].value==null ? 'Created!' : 'Updated!';
    const msgText = this.attForm.controls['memberAttId'].value==null ? 'Attachment has been created.!' : 'Attachment has been updated.';

    this.memberService.createAttachment(this.file, param).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const response: ApiResponse<MemberAttData> = <ApiResponse<MemberAttData>>JSON.parse(<string>event.body);
          if(response.status){
            Utils.alertSuccess({
              title: msgTitle,
              text: msgText
            });
            this.searchAtt();

            Utils.assign(this.addrSelectedRow, {...response.data});
            this.attForm.patchValue({
              ...response.data
            });
          }else{
            Utils.alertError({
              text: 'Please, try again later',
            });
          }
        } else {
          Utils.alertError({
            text: 'Please, try again later',
          });
        }
      }
    });
  }

  getDocPath(filePath: string, fileName: string) {
    this.memberService.getDocPath(this.attForm.controls['filePath'].value, this.attForm.controls['fileName'].value);
  }

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*---------------------------------------------------------- Case --------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchCase(){
    this.memberService.getMemberCaseList({
      pageSize: this.caseTableControl.pageSize,
      pageNo: this.caseTableControl.pageNo,
      data: { customerId:this.memberForm.controls['customerId'].value, sortColumn: this.caseTableControl.sortColumn, sortDirection: this.caseTableControl.sortDirection }
    }).then(result => {
      this.caseDS = result.data;
      this.caseTableControl.total = result.total;
      this.caseSelectedRow = null;
      this.caseForm.disable();
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onCaseEdit(e) {
    this.caseStore.updateCaseDetail(e.caseNumber);
  }

  onSelectCaseRow(row){
    this.caseSelectedRow = row;
    this.caseForm.patchValue(row);
    this.caseForm.disable();
  }
  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------- Transaction ----------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchTransaction(){
    this.memberService.getMemberTransactionList({
      pageSize: this.transactionTableControl.pageSize,
      pageNo: this.transactionTableControl.pageNo,
      data: { memberId:this.memberForm.controls['memberId'].value, sortColumn: this.transactionTableControl.sortColumn, sortDirection: this.transactionTableControl.sortDirection }
    }).then(result => {
      this.transactionDS = result.data;
      this.transactionTableControl.total = result.total;
      this.transactionSelectedRow = null;
      this.transactionForm.disable();
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });

  }

  onSelectTransactionRow(row){
    this.transactionSelectedRow = row;
    this.transactionForm.patchValue(row);
    this.transactionForm.disable();

    this.canCancelled = (this.transactionSelectedRow.txnStatusId == 'PROCESSED' && this.transactionSelectedRow.txnSubTypeId != 'CANCELLATION')?true:false;
  }

  showMoreTransaction(){
    const dialogRef = this.dialog.open(ShowMoreComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'my-dialog',
      data: { txnId: this.transactionSelectedRow.txnId }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  cancelTransaction(){
    const param = {
      txnId : this.transactionForm.value.txnId
    };
    this.txnApi.cancelTransaction({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.transactionForm, result.data);
        this.transactionForm.patchValue(result.data);
        this.canCancelled = (result.data.txnStatusId == 'PROCESSED' && result.data.txnSubTypeId != 'CANCELLATION')?true:false;;
        Utils.alertSuccess({
          title: 'Cancelled!',
          text: 'Transaction has been cancelled.!' ,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------- Change Log -----------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchChangeLog(){

  }

  onChangeNationality(nationality) {
    if (nationality == this.THAI_NATIONALITY) {
      this.memberForm.patchValue({ passportNo: null });
      this.memberForm.controls['citizenId'].setValidators([Validators.required, Validators.maxLength(13)]);
      this.memberForm.controls['citizenId'].updateValueAndValidity();
    } else {
      this.memberForm.patchValue({ citizenId: null });
      this.memberForm.controls['citizenId'].clearValidators();
      this.memberForm.controls['citizenId'].updateValueAndValidity();
    }
  }
}
