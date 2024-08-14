import { Component, Input, OnInit } from '@angular/core';
import Utils from 'src/app/shared/utils';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { AppStore } from 'src/app/shared/app.store';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ServiceRequestStore } from 'src/app/pages/service-request/service-request.store';
import { TableControl } from 'src/app/shared/table-control';
import { BaseComponent } from 'src/app/shared/base.component';
import { ServiceRequestModel } from 'src/app/pages/service-request/service-request.model';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from 'src/app/pages/common/created-by/created-by.component';

@Component({
  selector: 'app-customer-sr',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './customer-sr.component.html',
  styleUrl: './customer-sr.component.scss'
})
export class CustomerSrComponent extends BaseComponent implements OnInit {
  @Input() customerIdParam: any;

  createForm: FormGroup;
  srForm: FormGroup;

  /* SR table */
  srSelectedRow: ServiceRequestModel;
  srDS: ServiceRequestModel[];

  srColumn: string[] = ['srNumber', 'typeName', 'openedDate', 'closedDate', 'subTypeName', 'priorityName', 'action'];
  srTableControl: TableControl = new TableControl(() => { this.searchSr() });

  constructor(
    public customerService: CustomerService,
    public router: Router,
    public globals: Globals,
    private appStore: AppStore,
    public api: ApiService,
    private formBuilder: FormBuilder,
    private srStore: ServiceRequestStore,

  ) {
    super(router, globals);
  }


  ngOnInit(): void {


    this.srForm = this.formBuilder.group({
      srNumber: [''],
      typeName: [''],
      subTypeName: [''],
      priorityName: [''],
      subject: [''],
      detail: [''],
      channelName: [''],
      statusName: [''],
      createdBy: [''],
      updatedBy: [''],
      openedDateDate: [''],
      closedDateDate: [''],
      customerId: [''],
      displayName: [''],
      createdByName: new FormControl({ value: '', disabled: true }),
      createdDate: new FormControl({ value: '', disabled: true }),
      updatedByName: new FormControl({ value: '', disabled: true }),
      updatedDate: new FormControl({ value: '', disabled: true })
    });


    this.searchSr();

  }

  searchSr() {
    this.customerService.getCustomerSrList({
      pageSize: this.srTableControl.pageSize,
      pageNo: this.srTableControl.pageNo,
      data: { customerId: this.customerIdParam, sortColumn: this.srTableControl.sortColumn, sortDirection: this.srTableControl.sortDirection }
    }).then(result => {
      this.srDS = result.data;
      this.srTableControl.total = result.total;
      this.srSelectedRow = null;
      this.srForm.disable();
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSrEdit(e) {
    this.srStore.updateSrDetail(e.srNumber);
  }

  onSelectSrRow(row) {
    this.srSelectedRow = row;
    this.srForm.patchValue(row);
    this.srForm.disable();
  }

}
