import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { ChangeLog } from 'src/app/model/change-log.model';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CustomerService } from '../customer.service';
import Utils from 'src/app/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/shared/base.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerVerifyData } from './verify-customer-dialog/customer-verify-data';
import { TabManageService, TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/shared/app.store';
import { Dropdown } from 'src/app/model/dropdown.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { ContactHistoryTlComponent } from './tab/contact-history-tl/contact-history-tl.component';
import { CustomerCaseComponent } from "./tab/customer-case/customer-case.component";
import { CustomerAddressComponent } from './tab/customer-address/customer-address.component';
import { CustomerAuditLogComponent } from './tab/customer-audit-log/customer-audit-log.component';
import { CustomerSrComponent } from './tab/customer-sr/customer-sr.component';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
    imports: [SharedModule, CreatedByComponent, ContactHistoryTlComponent, CustomerCaseComponent, CustomerSrComponent, CustomerAddressComponent, CustomerAuditLogComponent]
})
export class CustomerDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild("contactHistoryTlComponent", { static: false })
  contactHistoryTlComponent: ContactHistoryTlComponent;

  @ViewChild("customerCase", { static: false })
  customerCaseComponent: CustomerCaseComponent;

  @ViewChild("customerSr", { static: false })
  customerSrComponent: CustomerSrComponent;

  @ViewChild("customerAddress", { static: false })
  customerAddressComponent: CustomerAddressComponent;

  @ViewChild("customerAuditLogComponent", { static: false })
  customerAuditLogComponent: CustomerAuditLogComponent;


  customerId: string;

  THAI_NATIONALITY: string = "37";
  THAI_COUNTRY_CODE: string = "66";

  newCaseSubscription: Subscription;



  createForm: FormGroup;
  // addressForm: UntypedFormGroup;

  createDisabled: Boolean;
  // addressDisabled: Boolean;

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
  // addressTypeList = [];
  customerStatusList = [];
  customerTypeList = [];
  provinceList = [];
  districtList = [];
  subDistrictList = [];
  postCodeList = [];
  // programList: Dropdown[];

  get c() { return this.createForm.controls; }


  selectedFiles: FileList;
  imageSrc: string;
  uploadProgress = 0;

  constructor(
    private tabManageService: TabManageService,
    private tabParam: TabParam,
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public customerService: CustomerService,
    private el: ElementRef,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    public globals: Globals,
    private appStore: AppStore
  ) {
    super(router, globals);
    this.api.getMultipleCodebookByCodeType({
      data: ['GENDER', 'MARITAL_STATUS', 'CUSTOMER_TYPE', 'OCCUPATION', 'TITLE_NAME', 'NATIONALITY', 'SOURCE_CHANNEL', 'PHONE_PREFIX', 'COUNTRY', 'ADDRESS_TYPE', 'CUSTOMER_CRM_STATUS', 'BUSINESS_TYPE']
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
        // this.addressTypeList = result.data['ADDRESS_TYPE'];
        this.customerStatusList = result.data['CUSTOMER_CRM_STATUS'];
        this.businessTypeList = result.data['BUSINESS_TYPE'];
        this.customerTypeList = result.data['CUSTOMER_TYPE'];
      }
    );


  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      customerId: [''],
      customerType: [true],
      customerStatus: ['01'],
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
      pictureUrl: [''],
      createdByName: new UntypedFormControl({ value: '', disabled: true }),
      createdDate: new UntypedFormControl({ value: '', disabled: true }),
      updatedByName: new UntypedFormControl({ value: '', disabled: true }),
      updatedDate: new UntypedFormControl({ value: '', disabled: true })
    });






    if (this.tabParam.params['customerId']) {
      this.customerId = this.tabParam.params['customerId'];

      this.customerService.getCustomerById({ data: { customerId: this.tabParam.params['customerId'] } })
        .then(result => {
          this.createForm.patchValue(result.data);
          this.createForm.patchValue({ 'previousCitizenId': this.createForm.value['citizenId'] });
          this.createForm.patchValue({ 'previousPassportNo': this.createForm.value['passportNo'] });


          Utils.setBirthDatePicker(this.createForm);
          this.setDisabled();

          this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.customer', { name: result.data.firstName || result.data.businessName });
        }, error => {
          Utils.alertError({
            text: 'กรุณาลองใหม่ภายหลัง',
          });
        });
    } else {
      this.create();
      this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.customer', { name: 'New' });
    }

    this.newCaseSubscription = this.appStore.observeNewCase().subscribe(val => {

      if (val.customerId === this.createForm.controls['customerId'].value) {
        this.customerCaseComponent.searchCase();
      }

      if (val.customerId === this.createForm.controls['customerId'].value) {
        this.customerSrComponent.searchSr();
      }
    });

  }

  ngOnDestroy() {
    this.newCaseSubscription.unsubscribe();
  }

  setDisabled() {
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
    // }
    this.createForm.controls['createdByName'].disable();
    this.createForm.controls['createdDate'].disable();
    this.createForm.controls['updatedByName'].disable();
    this.createForm.controls['updatedDate'].disable();

    this.CHECK_FORM_PERMISSION(this.createForm);
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
    this.createForm.patchValue({ customerType: true, customerStatus: '01', nationality: this.THAI_NATIONALITY, phoneArea: this.THAI_COUNTRY_CODE });
    this.customerAddressComponent.addressDS = null;
    this.imageSrc = null;
    this.changeCustomerType(false);
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

        this.createForm.controls[element].invalid
      });
      return;
    }
    this.verifyCitizenId();
  }


  checkValidateFormField() {
    console.log("begin");
    Object.keys(this.createForm.controls).forEach(element => {
      if (this.createForm.controls[element].invalid) {
        console.log(this.createForm.controls[element]);
      }
    });
    console.log("end");
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
              text: 'ไม่สามารถบันทึกลูกค้าได้ เนื่องจากเลขบัตรประชาชน ' + citizenId + " มีอยู่ในระบบแล้ว",
            });
          }
        } else {
          Utils.alertError({
            text: 'กรุณาลองใหม่ภายหลัง',
          });
        }
      }, error => {
        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
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
              text: 'ไม่สามารถบันทึกลูกค้าได้ เนื่องจากเลขหนังสือเดินทาง ' + passportNo + " มีอยู่ในระบบแล้ว",
            });
          }
        } else {
          Utils.alertError({
            text: 'กรุณาลองใหม่ภายหลัง',
          });
        }
      }, error => {
        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
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

    const msgTitle = this.createForm.value.customerId == null ? 'สร้างสำเร็จ!' : 'อัปเดตสำเร็จ!';
    const msgText = this.createForm.value.customerId == null ? 'สร้างข้อมูลลูกค้าสำเร็จ' : 'อัปเดตข้อมูลลูกค้าสำเร็จ';

    this.customerService.saveCustomer({
      data: param
    }).then(result => {
      if (result.status) {
        this.createForm.patchValue(result.data);
        this.customerId = result.data.customerId;
        Utils.setBirthDatePicker(this.createForm);
        this.createForm.patchValue({ 'previousCitizenId': this.createForm.value['citizenId'] });
        this.createForm.patchValue({ 'previousPassportNo': this.createForm.value['passportNo'] });
        this.setDisabled();
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });

        this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.customer', { name: result.data.firstName || result.data.businessName });
      } else {
        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
        });
      }
      //this.customerComp.search();
    }, error => {
      Utils.alertError({
        text: 'กรุณาลองใหม่ภายหลัง',
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

    if (this.customerAddressComponent.addressDS == null || this.customerAddressComponent.addressDS.length == 0) {
      Utils.alertError({
        text: 'กรุณากรอกที่อยู่'
      });
      return;
    }
    if (nextStatus == "01") { // Submit
      this.createForm.patchValue({ customerStatus: nextStatus });
      this.onSave();
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

          this.setDisabled();

        } else {
          Utils.alertError({
            text: 'กรุณาลองใหม่ภายหลัง',
          });
        }
        //this.customerComp.search();
      }, error => {
        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
        });
      });
    } else {
      this.sendUpdateStatus(nextStatus);
    }

  }

  sendUpdateStatus(nextStatus) {
    const msgTitle = this.createForm.value.customerId == null ? 'สร้างสำเร็จ!' : 'อัปเดตสำเร็จ!';
    const msgText = this.createForm.value.customerId == null ? 'สร้างข้อมูลลูกค้าสำเร็จ' : 'อัปเดตข้อมูลลูกค้าสำเร็จ';
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
        Utils.setBirthDatePicker(this.createForm);
        this.setDisabled();
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });

      } else {

        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
        });
      }

    }, error => {
      Utils.alertError({
        text: 'กรุณาลองใหม่ภายหลัง',
      });
    });
  }



  onChangeNationality(nationality) {
    if (nationality == this.THAI_NATIONALITY) {
      this.createForm.patchValue({ passportNo: null });
    } else {
      this.createForm.patchValue({ citizenId: null });
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

  upload() {

    this.uploadProgress = 0;
    console.log(this.selectedFiles);

    console.log(this.selectedFiles.item(0));

    this.customerService.uploadCustomerProfileImage(this.selectedFiles.item(0), this.customerId).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        if (event.status === 200) {
          Utils.alertSuccess({
            title: 'อัปโหลดสำเร็จ!',
            text: 'อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว',
          });

          this.createForm.get('pictureUrl').setValue(<string>event.body);

          // this.selectedRow.pictureUrl = <string>event.body;
        } else {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        }
        this.uploadProgress = 0;
        this.imageSrc = null;
      }
    });
    this.selectedFiles = null;
  }

}
