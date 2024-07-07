import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, FormGroupDirective, FormGroup } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { CustomerData } from './customer-data'
import { CustomerService } from './customer.service';
import { TableControl } from 'src/app/shared/table-control';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/shared/base.component';
import { MatSort } from '@angular/material/sort';
import { ModalConsultingService } from '../common/modal-consulting/modal-consulting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultingService } from '../consulting/consulting.service';
import ConsultingUtils from 'src/app/shared/consultingStore';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Dropdown } from 'src/app/model/dropdown.model';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class CustomerComponent extends BaseComponent implements OnInit {

  THAI_NATIONALITY: string = "37";

  /* customer table */

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  dataSource: CustomerData[];
  displayedColumns: string[] = ['customerStatus', 'fullName', 'citizenId', 'customerType', 'updatedDate', 'updatedByName'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchForm: FormGroup;


  selectedRow: CustomerData;
  createForm: FormGroup;

  customerTypeList: Dropdown[];
  customerStatusList: Dropdown[];
  titleNameList: Dropdown[];
  nationalityList: Dropdown[];

  constructor(
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private customerService: CustomerService,
    private el: ElementRef,
    public router: Router,
    public globals: Globals,
    private consultingService: ConsultingService,
    private spinner: NgxSpinnerService,
    private tabParam: TabParam,
    public iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    super(router, globals);
    iconRegistry.addSvgIcon('half-circle', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/adjust-solid.svg'));
    //iconRegistry.addSvgIcon('voice-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/phone-square-light.svg'));

    this.api.getMultipleCodebookByCodeType({
      data: ['CUSTOMER_CRM_STATUS', 'TITLE_NAME', 'NATIONALITY', 'CUSTOMER_TYPE']
    }).then(
      result => {
        this.customerStatusList = result.data['CUSTOMER_CRM_STATUS'];
        this.titleNameList = result.data['TITLE_NAME'];
        this.nationalityList = result.data['NATIONALITY'];
        this.customerTypeList = result.data['CUSTOMER_TYPE'];
      }
    );
  }

  get f() { return this.searchForm.controls; }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      citizenId: [''],
      passportNo: [''],
      customerStatus: [''],
      customerType: [''],
      phoneNo: [''],
    });
    this.defaultCriteriaSearchFromOtherPage();

    this.createForm = this.formBuilder.group({
      memberId: [''],
      customerId: [''],
      customerType: [true],
      customerStatus: ['01'],
      pictureUrl: [''],
      title: new UntypedFormControl({ value: '' }),
      firstName: new UntypedFormControl({ value: '' }),
      lastName: new UntypedFormControl({ value: '' }),
      nationality: new UntypedFormControl({ value: this.THAI_NATIONALITY, }),
      citizenId: new UntypedFormControl({ value: '' }),
      passportNo: new UntypedFormControl({ value: '' }),
      birthDate: [''],
      gender: [''],
      maritalStatus: [''],
      occupation: [''],
      businessName: new UntypedFormControl({ value: '' }),
      taxId: new UntypedFormControl({ value: '' }),
      businessType: [''],
      phoneArea: [''],
      phoneNo: [''],
      email: [''],
      registrationChannel: [''],
      registrationStore: [''],
      remark: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      address: [],
      changeLog: []
    });
    this.tableControl.sortColumn = 'fullName';
    this.tableControl.sortDirection = 'asc';
    this.onSearch();

    this.CHECK_FORM_PERMISSION(this.createForm);

  }

  defaultCriteriaSearchFromOtherPage() {
    if (this.tabParam.params.phoneNo != null && this.tabParam.params.phoneNo != undefined) {
      this.searchForm.patchValue({ phoneNo: this.tabParam.params.phoneNo });
    }

  }

  onSearch() {
    /*  if (this.searchForm.invalid) {
       return;
     } */

    this.selectedRow = null;
    this.search();
  }

  search() {
    const param = {
      ...this.searchForm.value,
      memberCardNo: this.searchForm.value['memberCardNo'] != null ? this.searchForm.value['memberCardNo'].replace(/\s/g, "") : this.searchForm.value['memberCardNo'], // Remove white space
      sortColumn: this.tableControl.sortColumn,
      sortDirection: this.tableControl.sortDirection
    }
    this.customerService.getCustomerList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }



  selectCustomer(row) {
    this.selectedRow = row;
    this.createForm.patchValue(row);
  }


  clear() {
    this.searchForm.reset();
    //this.clearSort();
    this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  selectCustomerConsulting(customerType: string) {

    if (ConsultingUtils.isConsulting()) {
      const contData = JSON.parse(ConsultingUtils.getConsultingData());
      const params = {
        data: {
          consultingNumber: contData.consultingNumber,
          customerId: this.createForm.controls['customerId'].value,
          contactId: this.createForm.controls['customerId'].value
        }
      };

      this.consultingService.updateConsultingBindingCustomer(params).then((result: any) => {
        this.spinner.hide("approve_process_spinner");
        if (result.status) {

          this.gotoMemberCustomerPage(customerType);

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
      this.gotoMemberCustomerPage(customerType);
    }

  }


  gotoMemberCustomerPage(customerType: string) {

    if (customerType == "member") {
      this.router.navigate([
        "/customer/member",
        {
          memberId: this.createForm.controls['memberId'].value,
        },
      ]);
    }

    if (customerType == "customer") {
      this.router.navigate([
        "/customer/customer",
        {
          customerId: this.createForm.controls['customerId'].value,
        },
      ]);
    }

  }



}
