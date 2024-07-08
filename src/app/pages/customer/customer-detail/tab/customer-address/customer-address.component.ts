import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { CustomerAddressData } from '../../../customer-address-data';
import { TableControl } from 'src/app/shared/table-control';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { AppStore } from 'src/app/shared/app.store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { SharedModule } from 'src/app/shared/module/shared.module';


@Component({
  selector: 'app-customer-address',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-address.component.html',
  styleUrl: './customer-address.component.scss'
})
export class CustomerAddressComponent extends BaseComponent implements OnInit {

  @Input() customerIdParam: any;

  THAI_NATIONALITY: string = "37";
  THAI_COUNTRY_CODE: string = "66";
  addressDisabled: Boolean;
  addressForm: FormGroup;
  /* address table */
  addrSelectedRow: CustomerAddressData;
  addressDS: CustomerAddressData[];
  addressColumn: string[] = ['primary', 'addressType', 'address', 'actionDelAdd'];
  addrTableControl: TableControl = new TableControl(() => { this.searchAddress() });
  deleted = false;
  provinceList = [];
  districtList = [];
  subDistrictList = [];
  postCodeList = [];

  countryList = [];
  addressTypeList = [];

  constructor(
    public customerService: CustomerService,
    public router: Router,
    public globals: Globals,
    private appStore: AppStore,
    public api: ApiService,
    private formBuilder: FormBuilder,
  ) {
    super(router, globals);
    this.api.getMultipleCodebookByCodeType({
      data: ['COUNTRY', 'ADDRESS_TYPE']
    }).then(
      result => {
        this.countryList = result.data['COUNTRY'];
        this.addressTypeList = result.data['ADDRESS_TYPE'];
      }
    );


  }


  ngOnInit(): void {

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
      createdByName: new FormControl({ value: '', disabled: true }),
      createdDate: new FormControl({ value: '', disabled: true }),
      updatedBy: new FormControl({ value: '', disabled: true }),
      updatedDate: new FormControl({ value: '', disabled: true })
    });

    this.searchAddress();
  }




  searchAddress() {

    this.customerService.getCustomerAddressList({
      pageSize: this.addrTableControl.pageSize,
      pageNo: this.addrTableControl.pageNo,
      data: { customerId: this.customerIdParam, sortColumn: this.addrTableControl.sortColumn, sortDirection: this.addrTableControl.sortDirection }
    }).then(result => {
      this.addressDS = result.data;
      this.addrTableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
    this.CHECK_FORM_PERMISSION(this.addressForm);
  }

  selectAddress(row) {
    this.addrSelectedRow = row;
    this.addressForm.patchValue(row);
    this.addressForm.patchValue({ primary: row.primaryYn == "Y" });
    this.addressForm.patchValue({ previousPrimaryYn: this.addressForm.value['primary'] });
    this.setComboAddress(row.subDistrict);
  }

  addressAdd() {
    if (this.customerIdParam == null) {
      Utils.confirm("Warning", "Please Save Customer before create address.", "Save Customer").then(confirm => {
        if (confirm.value) {

        }
      });
      return false;
    }

    this.addrSelectedRow = {};
    this.addressForm.reset();
    this.addressForm.patchValue({ customerId: this.customerIdParam });
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
          customerId: this.customerIdParam
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
          this.addrSelectedRow = null;
          this.searchAddress();

        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

  setDisabledAddress() {
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
