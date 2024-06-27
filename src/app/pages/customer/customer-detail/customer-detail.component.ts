import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CustomerAddressData } from '../customer-address-data';
import { TableControl } from 'src/app/shared/table-control';
import { ChangeLog } from 'src/app/model/change-log.model';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CustomerService } from '../customer.service';
import Utils from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/shared/base.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerVerifyData } from './verify-customer-dialog/customer-verify-data';
import { TabManageService, TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { Case } from '../../case/case.model';
import { CaseStore } from '../../case/case.store';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/shared/app.store';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ContactHistoryComponent } from '../contact-history/contact-history.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild("contactHistoryConponent", { static: false })
  contactHistoryConponent: ContactHistoryComponent;
  customerId: string;

  THAI_NATIONALITY: string = "37";
  THAI_COUNTRY_CODE: string = "66";

  newCaseSubscription: Subscription;

  /* address table */
  addrSelectedRow: CustomerAddressData;
  addressDS: CustomerAddressData[];
  addressColumn: string[] = ['primary', 'addressType', 'address', 'actionDelAdd'];
  addrTableControl: TableControl = new TableControl(() => { this.searchAddress() });
  deleted = false;

  /* Case table */
  caseSelectedRow: Case;
  caseDS: Case[];
  caseColumn: string[] = ['caseNumber', 'typeName', 'openedDate', 'closedDate', 'subTypeName', 'priorityName', 'action'];
  caseTableControl: TableControl = new TableControl(() => { this.searchCase() });


  /* change log table */
  chSelectedRow: ChangeLog;
  changeLogDS: ChangeLog[];
  changeLogColumn: string[] = ['changedBy', 'changedDetail', 'changedDate'];
  changeLogTableControl: TableControl = new TableControl(() => { this.searchChangeLog() });

  createForm: UntypedFormGroup;
  addressForm: UntypedFormGroup;
  caseForm: UntypedFormGroup;

  createDisabled: Boolean;
  addressDisabled: Boolean;

  customerVerify: CustomerVerifyData;

  titleNameList = [];
  nationalityList = [];
  occupationList = [];
  businessTypeList = [];
  genderList = [];
  maritalList = [];
  sourceChannelList = [];
  phonePrefixList = [];
  regisStoreList = [{
    codeId: "000",
    codeName: "Head Office"
  }];
  countryList = [];
  addressTypeList = [];
  customerStatusList = [];
  provinceList = [];
  districtList = [];
  subDistrictList = [];
  postCodeList = [];
  programList: Dropdown[];

  get c() { return this.createForm.controls; }

  constructor(
    private caseStore: CaseStore,
    private tabManageService: TabManageService,
    private tabParam: TabParam,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private customerService: CustomerService,
    private el: ElementRef,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    public globals: Globals,
    private appStore: AppStore
  ) {
    super(router, globals);
    this.api.getMultipleCodebookByCodeType({
      data: ['GENDER', 'MARITAL_STATUS', 'OCCUPATION', 'TITLE_NAME', 'NATIONALITY', 'SOURCE_CHANNEL', 'PHONE_PREFIX', 'COUNTRY', 'ADDRESS_TYPE', 'CUSTOMER_STATUS', 'BUSINESS_TYPE']
    }).then(
      result => {
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
        this.businessTypeList = result.data['BUSINESS_TYPE'];
      }
    );

    // Load program list.
    this.api.getProgram().then(result => {
      this.programList = result.data;
    });
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      customerId: [''],
      customerType: [true],
      customerStatus: ['1'],
      title: [''],
      firstName: [''],
      lastName: [''],
      nationality: [this.THAI_NATIONALITY],
      citizenId: [''],
      previousCitizenId: [''],
      passportNo: [''],
      previousPassportNo: [''],
      birthDate: [''],
      gender: [''],
      maritalStatus: [''],
      occupation: [''],
      businessName: [''],
      taxId: [''],
      businessType: [''],
      phoneArea: [''],
      phoneNo: [''],
      email: [''],
      registrationChannel: [''],
      registrationStore: [''],
      remark: [''],
      programId: [''],
      createdBy: new UntypedFormControl({ value: '', disabled: true }),
      createdDate: new UntypedFormControl({ value: '', disabled: true }),
      updatedBy: new UntypedFormControl({ value: '', disabled: true }),
      updatedDate: new UntypedFormControl({ value: '', disabled: true })
    });

    this.addressForm = this.formBuilder.group({
      addressId: [],
      customerId: [],
      primary: [''],
      previousPrimaryYn: [''],
      addressType: [''],
      address: [''],
      postCode: [''],
      subDistrict: [''],
      district: [''],
      province: [''],
      country: [''],
      createdBy: new UntypedFormControl({ value: '', disabled: true }),
      createdDate: new UntypedFormControl({ value: '', disabled: true }),
      updatedBy: new UntypedFormControl({ value: '', disabled: true }),
      updatedDate: new UntypedFormControl({ value: '', disabled: true })
    });

    this.caseForm = this.formBuilder.group({
      caseNumber: [''],
      typeName: [''],
      subTypeName: [''],
      priorityName: [''],
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
    // this.route.params.subscribe(params=>{
    //   if(params['customerId']!=null){
    //     this.customerService.getCustomerById({data:{customerId:params['customerId']}})
    //     .then(result => {
    //       this.createForm.patchValue(result.data);
    //       this.setProgram(result.data.programId);
    //       this.setDisabled();
    //       this.searchAddress();
    //     }, error => {
    //       Utils.alertError({
    //         text: 'Please try again later.',
    //       });
    //     });
    //   }else{
    //     this.create();
    //     this.setProgram(null);
    //   }
    // });

    if (this.tabParam.params['customerId']) {
      this.customerId = this.tabParam.params['customerId'];
      this.customerService.getCustomerById({ data: { customerId: this.tabParam.params['customerId'] } })
        .then(result => {
          this.createForm.patchValue(result.data);
          this.createForm.patchValue({ 'previousCitizenId': this.createForm.value['citizenId'] });
          this.createForm.patchValue({ 'previousPassportNo': this.createForm.value['passportNo'] });
          this.createForm.patchValue({ 'programId': this.createForm.value['programId'].toString() });
          Utils.setBirthDatePicker(this.createForm);
          this.setDisabled();
          this.searchAddress();
          this.searchCase();
          this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.customer', { name: result.data.firstName || result.data.businessName });
        }, error => {
          Utils.alertError({
            text: 'Please try again later.',
          });
        });
    } else {
      this.create();
      this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.customer', { name: 'New' });
    }

    this.newCaseSubscription = this.appStore.observeNewCase().subscribe(newCase => {
      if (newCase.customerId === this.createForm.controls['customerId'].value) {
        this.searchCase();
      }
    });

  }

  ngOnDestroy() {
    this.newCaseSubscription.unsubscribe();
  }

  setDisabled() {
    if (this.createForm.value.customerStatus > "00") {
      this.createDisabled = true;
      this.addressDisabled = true;
    } else {
      this.createDisabled = false;
      this.addressDisabled = false;
    }
    if (this.createDisabled) {
      this.createForm.controls['customerType'].disable();
      this.createForm.controls['title'].disable();
      this.createForm.controls['firstName'].disable();
      this.createForm.controls['lastName'].disable();
      this.createForm.controls['nationality'].disable();
      this.createForm.controls['citizenId'].disable();
      this.createForm.controls['passportNo'].disable();
      this.createForm.controls['birthDate'].disable();
      this.createForm.controls['gender'].disable();
      this.createForm.controls['maritalStatus'].disable();
      this.createForm.controls['occupation'].disable();
      this.createForm.controls['businessName'].disable();
      this.createForm.controls['taxId'].disable();
      this.createForm.controls['businessType'].disable();
      this.createForm.controls['phoneArea'].disable();
      this.createForm.controls['phoneNo'].disable();
      this.createForm.controls['email'].disable();
      this.createForm.controls['registrationChannel'].disable();
      this.createForm.controls['registrationStore'].disable();
      this.createForm.controls['remark'].disable();
      this.createForm.controls['programId'].disable();
    } else {
      this.createForm.controls['customerType'].enable();
      this.createForm.controls['title'].enable();
      this.createForm.controls['firstName'].enable();
      this.createForm.controls['lastName'].enable();
      this.createForm.controls['nationality'].enable();
      this.createForm.controls['citizenId'].enable();
      this.createForm.controls['passportNo'].enable();
      this.createForm.controls['birthDate'].enable();
      this.createForm.controls['gender'].enable();
      this.createForm.controls['maritalStatus'].enable();
      this.createForm.controls['occupation'].enable();
      this.createForm.controls['businessName'].enable();
      this.createForm.controls['taxId'].enable();
      this.createForm.controls['businessType'].enable();
      this.createForm.controls['phoneArea'].enable();
      this.createForm.controls['phoneNo'].enable();
      this.createForm.controls['email'].enable();
      this.createForm.controls['registrationChannel'].enable();
      this.createForm.controls['registrationStore'].enable();
      this.createForm.controls['remark'].enable();
      this.createForm.controls['programId'].enable();
    }
    this.createForm.controls['createdBy'].disable();
    this.createForm.controls['createdDate'].disable();
    this.createForm.controls['updatedBy'].disable();
    this.createForm.controls['updatedDate'].disable();

    this.setDisabledAddress();
    this.CHECK_FORM_PERMISSION(this.createForm);
    this.CHECK_FORM_PERMISSION(this.addressForm);
  }

  setDisabledAddress() {
    if (this.addressDisabled) {
      this.addressForm.controls['primary'].disable();
      this.addressForm.controls['addressType'].disable();
      this.addressForm.controls['address'].disable();
      this.addressForm.controls['postCode'].disable();
      this.addressForm.controls['subDistrict'].disable();
      this.addressForm.controls['district'].disable();
      this.addressForm.controls['province'].disable();
      this.addressForm.controls['country'].disable();
    } else {
      this.addressForm.controls['primary'].enable();
      this.addressForm.controls['addressType'].enable();
      this.addressForm.controls['address'].enable();
      this.addressForm.controls['postCode'].enable();
      this.addressForm.controls['subDistrict'].enable();
      this.addressForm.controls['district'].enable();
      this.addressForm.controls['province'].enable();
      this.addressForm.controls['country'].enable();
    }
  }

  changeCustomerType(val) {
    if (!val) {
      this.createForm.controls['firstName'].setValidators([Validators.required, Validators.maxLength(255)]);
      this.createForm.controls['firstName'].updateValueAndValidity();
      this.createForm.controls['lastName'].setValidators([Validators.required, Validators.maxLength(255)]);
      this.createForm.controls['lastName'].updateValueAndValidity();
      this.createForm.controls['citizenId'].setValidators([Validators.required, Validators.maxLength(13)]);
      this.createForm.controls['citizenId'].updateValueAndValidity();
      this.createForm.controls['businessName'].clearValidators();
      this.createForm.controls['businessName'].updateValueAndValidity();
    } else {
      this.createForm.controls['firstName'].clearValidators();
      this.createForm.controls['firstName'].updateValueAndValidity();
      this.createForm.controls['lastName'].clearValidators();
      this.createForm.controls['lastName'].updateValueAndValidity();
      this.createForm.controls['citizenId'].clearValidators();
      this.createForm.controls['citizenId'].updateValueAndValidity();
      this.createForm.controls['businessName'].setValidators([Validators.required, Validators.maxLength(255)]);
      this.createForm.controls['businessName'].updateValueAndValidity();
    }
  }

  create() {
    this.createForm.reset();
    this.createForm.patchValue({ customerType: true, customerStatus: '00', nationality: this.THAI_NATIONALITY, phoneArea: this.THAI_COUNTRY_CODE });
    this.addressDS = null;
    this.changeCustomerType(false);
  }

  searchAddress() {
    this.customerService.getCustomerAddressList({
      pageSize: this.addrTableControl.pageSize,
      pageNo: this.addrTableControl.pageNo,
      data: { customerId: this.createForm.value.customerId, sortColumn: this.addrTableControl.sortColumn, sortDirection: this.addrTableControl.sortDirection }
    }).then(result => {
      this.addressDS = result.data;
      this.addrTableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  selectAddress(row) {
    this.addrSelectedRow = row;
    this.addressForm.patchValue(row);
    this.addressForm.patchValue({ primary: row.primaryYn == "Y" });
    this.addressForm.patchValue({ previousPrimaryYn: this.addressForm.value['primary'] });
    this.setComboAddress(row.subDistrict);
  }

  onCancel() {
    this.createForm.reset();
  }

  /**
   * Validate mandatory fields before save customer.
   * If this mandatory validation is passed, it will verify citizen id, verify passport no., and then save customer.
   */
  onSave() {
    // Customer type: true => individual, false => corporate
    let customerType = this.createForm.controls['customerType'].value;

    this.createForm.controls['phoneArea'].clearValidators();
    this.createForm.controls['phoneArea'].updateValueAndValidity();
    // this.createForm.controls['phoneNo'].clearValidators();
    // this.createForm.controls['phoneNo'].updateValueAndValidity();

    let nationality = this.createForm.controls['nationality'].value;

    // If this customer type is individual and has Thai nationaility, verify his citizen id.
    if (customerType && this.THAI_NATIONALITY == nationality) {
      this.createForm.controls['citizenId'].setValidators([Validators.required, Validators.maxLength(13)]);
      this.createForm.controls['citizenId'].updateValueAndValidity();
    } else if (customerType) { // If this customer type is individual and his nationaility isn't Thai, don't verify his citizen id.
      this.createForm.controls['citizenId'].clearValidators();
      this.createForm.controls['citizenId'].updateValueAndValidity();
    } else { // If this customer type is corporate, don't verify first name, last name, and citizen id.
      this.createForm.controls['firstName'].clearValidators();
      this.createForm.controls['firstName'].updateValueAndValidity();

      this.createForm.controls['lastName'].clearValidators();
      this.createForm.controls['lastName'].updateValueAndValidity();

      this.createForm.controls['citizenId'].clearValidators();
      this.createForm.controls['citizenId'].updateValueAndValidity();
    }
    if (this.createForm.invalid) {
      console.log("invalid createForm");
      Object.keys(this.createForm.controls).forEach(element => {
        this.createForm.controls[element].markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.verifyCitizenId();
  }

  /**
   * Validate citizen id by check format and verify duplicate value.
   */
  verifyCitizenId() {

    // Customer type: true => individual, false => corporate
    let customerType = this.createForm.controls['customerType'].value;
    let nationality = this.createForm.controls['nationality'].value;

    let previousCitizenId = this.createForm.value['previousCitizenId'];
    let citizenId = customerType && this.THAI_NATIONALITY == nationality ? this.createForm.controls['citizenId'].value : null;

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
        citizenId: citizenId
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

    // Customer type: true => individual, false => corporate
    let customerType = this.createForm.controls['customerType'].value;
    let nationality = this.createForm.controls['nationality'].value;

    let previousPassportNo = this.createForm.value['previousPassportNo'];
    let passportNo = customerType && this.THAI_NATIONALITY != nationality ? this.createForm.controls['passportNo'].value : null;

    if (!passportNo || previousPassportNo == passportNo) {
      this.saveCustomer();
    } else {
      const param = {
        passportNo: passportNo
      };
      this.customerService.getCustomerByCitizenIdOrPassportNo({
        data: param
      }).then(result => {
        if (result.status) {
          if (result.data.length == 0) {
            this.saveCustomer();
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

  saveCustomer() {
    // Customer type: true => individual, false => corporate
    let customerType = this.createForm.controls['customerType'].value;
    let nationality = this.createForm.controls['nationality'].value;

    const param = {
      ...this.createForm.value
      , birthDate: Utils.getDateString(this.createForm.value['birthDate'])
      , title: customerType ? this.createForm.controls['title'].value : null
      , firstName: customerType ? this.createForm.controls['firstName'].value : null
      , lastName: customerType ? this.createForm.controls['lastName'].value : null
      , nationality: customerType ? this.createForm.controls['nationality'].value : null
      , citizenId: customerType && this.THAI_NATIONALITY == nationality ? this.createForm.controls['citizenId'].value : null
      , passportNo: customerType && this.THAI_NATIONALITY != nationality ? this.createForm.controls['passportNo'].value : null
      , gender: customerType ? this.createForm.controls['gender'].value : null
      , maritalStatus: customerType ? this.createForm.controls['maritalStatus'].value : null
      , occupation: customerType ? this.createForm.controls['occupation'].value : null
      , businessName: !customerType ? this.createForm.controls['businessName'].value : null
      , taxId: !customerType ? this.createForm.controls['taxId'].value : null
      , businessType: !customerType ? this.createForm.controls['businessType'].value : null
    };

    const msgTitle = this.createForm.value.customerId == null ? 'Created!' : 'Updated!';
    const msgText = this.createForm.value.customerId == null ? 'Customer has been created.!' : 'Customer has been updated.';

    this.customerService.saveCustomer({
      data: param
    }).then(result => {
      if (result.status) {
        this.createForm.patchValue(result.data);
        Utils.setBirthDatePicker(this.createForm);
        this.createForm.patchValue({ 'previousCitizenId': this.createForm.value['citizenId'] });
        this.createForm.patchValue({ 'previousPassportNo': this.createForm.value['passportNo'] });
        this.createForm.patchValue({ 'programId': result.data.programId.toString() });
        this.setDisabled();
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });

        this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.customer', { name: result.data.firstName || result.data.businessName });
      } else {
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
      //this.customerComp.search();
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  onChangeStatus(nextStatus) {
    this.createForm.controls['phoneArea'].setValidators([Validators.required]);
    this.createForm.controls['phoneArea'].updateValueAndValidity();
    this.createForm.controls['phoneNo'].setValidators([Validators.required]);
    this.createForm.controls['phoneNo'].updateValueAndValidity();
    this.createForm.controls['email'].setValidators([Validators.required, Validators.maxLength(100), Validators.email]);
    this.createForm.controls['email'].updateValueAndValidity();

    if (this.createForm.controls['customerType'].value && this.THAI_NATIONALITY == this.createForm.controls['nationality'].value) {
      this.createForm.controls['citizenId'].setValidators([Validators.required, Validators.maxLength(13)]);
      this.createForm.controls['citizenId'].updateValueAndValidity();
    } else {
      this.createForm.controls['firstName'].clearValidators();
      this.createForm.controls['firstName'].updateValueAndValidity();

      this.createForm.controls['lastName'].clearValidators();
      this.createForm.controls['lastName'].updateValueAndValidity();

      this.createForm.controls['citizenId'].clearValidators();
      this.createForm.controls['citizenId'].updateValueAndValidity();
    }
    if (this.createForm.invalid) {
      console.log("invalid createForm");
      Object.keys(this.createForm.controls).forEach(element => {
        this.createForm.controls[element].markAsTouched({ onlySelf: true });
      });
      return;
    }
    if (this.addressDS == null || this.addressDS.length == 0) {
      Utils.alertError({
        text: 'Require Address'
      });
      return;
    }
    if (nextStatus == "01") { // Submit
      this.createForm.patchValue({ customerStatus: nextStatus });
      this.onSave();
      /*} else if ("02" == nextStatus) {
        this.createForm.enable();
        const param = {
          ...this.createForm.value
        };
        this.setDisabled();
        this.customerService.verifyRequest({
          data: param
        }).then(result => {
          if (result.status) {
            this.customerVerify = result.data;
  
            const dialogRef = this.dialog.open(VerifyCustomerDialogComponent, {
              width: '400px',
              data: this.customerVerify
            });
  
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
              this.customerVerify.key = result;
              if (result == null || result == "") {
                return;
              }
              this.customerService.verifyValidate({
                data: this.customerVerify
              }).then(result => {
                if (result.status) {
                  if ("OK" == result.data) {
                    this.sendUpdateStatus(nextStatus);
                  } else {
                    Utils.alertError({
                      text: 'Verify key not valid.',
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
            });
  
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
        */
    } else if ("04" == nextStatus) { // Active, create member.
      const param = {
        ...this.createForm.value
      };
      this.customerService.createMember({
        data: param
      }).then(result => {
        if (result.status) {
          this.router.navigate(["/customer/member",
            {
              memberId: result.data.memberId,
              memberType: result.data.memberType
            }]);
          // console.log(result.data);
          // this.createForm.patchValue(result.data);
          this.setDisabled();
          // this.tabManageService.removeTab(this.tabParam.index);
        } else {
          Utils.alertError({
            text: 'Please, try again later',
          });
        }
        //this.customerComp.search();
      }, error => {
        Utils.alertError({
          text: 'Please, try again later',
        });
      });
    } else {
      this.sendUpdateStatus(nextStatus);
    }

  }

  sendUpdateStatus(nextStatus) {
    const msgTitle = this.createForm.value.customerId == null ? 'Created!' : 'Updated!';
    const msgText = this.createForm.value.customerId == null ? 'Customer has been created.!' : 'Customer has been updated.';
    const param = {
      ...this.createForm.value
      , birthDate: Utils.getDateString(this.createForm.value['birthDate'])
      , customerStatus: nextStatus
    };
    this.customerService.updateCustomerStatus({
      data: param
    }).then(result => {
      if (result.status) {
        this.createForm.patchValue(result.data);
        this.createForm.patchValue({ 'programId': result.data.programId.toString() });
        Utils.setBirthDatePicker(this.createForm);
        this.setDisabled();
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      } else {
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
      //this.customerComp.search();
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }


  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------- Address -----------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  addressAdd() {
    if (this.createForm.value.customerId == null) {
      Utils.confirm("Warning", "Please Save Customer before create address.", "Save Customer").then(confirm => {
        if (confirm.value) {
          this.onSave();
        }
      });
      return false;
    }
    this.addrSelectedRow = {};
    this.addressForm.reset();
    this.addressForm.patchValue({ customerId: this.createForm.value.customerId });
    if (this.addressDS == null) {
      this.addressForm.patchValue({ primary: true, addressType: '02', country: this.THAI_COUNTRY_CODE, previousPrimaryYn: false });
    } else {
      this.addressForm.patchValue({ country: this.THAI_COUNTRY_CODE, previousPrimaryYn: false });
    }
    this.setDisabledAddress();
    setTimeout(() => {
      document.querySelector("#divAddressEditMode").scrollIntoView(true);
    }, 300);
    this.changeCountry();
  }

  onCancelAddress() {
    this.addrSelectedRow = null;
    this.addressForm.reset();
  }
  changeCountry() {
    this.addressForm.patchValue({ province: null, district: null, subDistrict: null, postCode: '' });
    if (this.addressForm.controls['country'].value == this.THAI_COUNTRY_CODE) {
      this.addressForm.controls['province'].setValidators([Validators.required]);
      this.addressForm.controls['province'].updateValueAndValidity();
      this.addressForm.controls['district'].setValidators([Validators.required]);
      this.addressForm.controls['district'].updateValueAndValidity();
      this.addressForm.controls['subDistrict'].setValidators([Validators.required]);
      this.addressForm.controls['subDistrict'].updateValueAndValidity();
      this.addressForm.controls['postCode'].setValidators([Validators.required]);
      this.addressForm.controls['postCode'].updateValueAndValidity();
    } else {
      this.addressForm.controls['province'].clearValidators();
      this.addressForm.controls['province'].updateValueAndValidity();
      this.addressForm.controls['district'].clearValidators();
      this.addressForm.controls['district'].updateValueAndValidity();
      this.addressForm.controls['subDistrict'].clearValidators();
      this.addressForm.controls['subDistrict'].updateValueAndValidity();
      this.addressForm.controls['postCode'].clearValidators();
      this.addressForm.controls['postCode'].updateValueAndValidity();
    }

    this.api.getProvince({ data: this.addressForm.controls['country'].value }).then(
      result => {
        this.provinceList = result.data;
        this.districtList = [];
        this.subDistrictList = [];
        this.postCodeList = [];
      }
    );
  }

  changeProvince() {
    this.api.getDistrict({ data: this.addressForm.controls['province'].value }).then(
      result => {
        this.districtList = result.data;
        this.subDistrictList = [];
        this.postCodeList = [];
      }
    );
  }

  changeDistrict() {
    this.api.getSubDistrict({ data: this.addressForm.controls['district'].value }).then(
      result => {
        this.subDistrictList = result.data;
        this.postCodeList = [];
      }
    );
  }

  changeSubDistrict() {
    this.api.getPostCode({ data: this.addressForm.controls['subDistrict'].value }).then(
      result => {
        this.postCodeList = result.data;
        if (result.data.length == 1) {
          this.addressForm.patchValue({ postCode: this.postCodeList[0].codeId });
        }
      }
    );
  }

  keypressPostCode() {
    if (this.addressForm.controls['postCode'].value.length == 5) {
      this.api.getPostCodeDetail({ data: this.addressForm.controls['postCode'].value }).then(
        result => {
          this.postCodeList = result.data;
        }
      );
    }
  }
  selectPostCode(subDistrict) {
    if (this.addressForm.controls['country'].value != this.THAI_COUNTRY_CODE) {
      return false;
    }

    if (subDistrict != this.addressForm.controls['subDistrict'].value) {
      this.setComboAddress(subDistrict);
    }
  }

  setComboAddress(subDistrict) {
    if (subDistrict == null || subDistrict.length < 4) {
      this.changeCountry();
      return;
    }
    if (subDistrict != null) {
      this.api.getProvince({ data: this.addressForm.controls['country'].value }).then(
        result => {
          this.provinceList = result.data;
          this.api.getDistrict({ data: subDistrict.substring(0, 2) }).then(
            result => {
              this.districtList = result.data;
              this.api.getSubDistrict({ data: subDistrict.substring(0, 4) }).then(
                result => {
                  this.subDistrictList = result.data;
                  this.addressForm.patchValue({ province: subDistrict.substring(0, 2), district: subDistrict.substring(0, 4), subDistrict: subDistrict });
                }
              );
            }
          );
        }
      );
    } else {
      this.changeCountry();
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
      this.customerService.getCustomerAddressPrimary({
        data: {
          customerId: this.createForm.controls['customerId'].value
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
      // primaryYn: (this.addressForm.controls['primary'].value ? "Y" : "N")
      // addressId: addressId,
      primaryYn: Utils.convertToYN(this.addressForm.value['primary']),
    };

    const msgTitle = this.addressForm.value.addressId == null ? 'Created!' : 'Updated!';
    const msgText = this.addressForm.value.addressId == null ? 'Address has been created.!' : 'Address has been updated.';

    this.customerService.saveCustomerAddress({
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
      console.log("error");
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  onDeleteCustomerAddress(element: CustomerAddressData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.customerService.deleteCustomerAddress({
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
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

  /*
  onSaveAddress() {
    const param = {
      ...this.addressForm.value,
      primaryYn: (this.addressForm.controls['primary'].value ? "Y" : "N")
    };
    if (this.addressForm.invalid) {
      console.log("invalid");
      Object.keys(this.addressForm.controls).forEach(element => {
        this.addressForm.controls[element].markAsTouched({ onlySelf: true });
      });
      return;
    }

    const msgTitle = this.addressForm.value.addressId == null ? 'Created!' : 'Updated!';
    const msgText = this.addressForm.value.addressId == null ? 'Address has been created.!' : 'Address has been updated.';

    this.customerService.saveCustomerAddress({
      data: param
    }).then(result => {
      console.log(result);
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
      console.log("error");
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }
  */


  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*---------------------------------------------------------- Case --------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  searchCase() {
    this.customerService.getCustomerCaseList({
      pageSize: this.caseTableControl.pageSize,
      pageNo: this.caseTableControl.pageNo,
      data: { customerId: this.createForm.controls['customerId'].value, sortColumn: this.caseTableControl.sortColumn, sortDirection: this.caseTableControl.sortDirection }
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

  onSelectCaseRow(row) {
    this.caseSelectedRow = row;
    this.caseForm.patchValue(row);
    this.caseForm.disable();
  }

  searchChangeLog() {

  }

  onChangeNationality(nationality) {
    if (nationality == this.THAI_NATIONALITY) {
      this.createForm.patchValue({ passportNo: null });
    } else {
      this.createForm.patchValue({ citizenId: null });
    }
  }

}
