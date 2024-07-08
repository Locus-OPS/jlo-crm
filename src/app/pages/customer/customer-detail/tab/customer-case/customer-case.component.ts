import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Case } from 'src/app/pages/case/case.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/shared/app.store';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { CaseStore } from 'src/app/pages/case/case.store';

@Component({
  selector: 'app-customer-case',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-case.component.html',
  styleUrl: './customer-case.component.scss'

})
export class CustomerCaseComponent extends BaseComponent implements OnInit {

  @Input() customerIdParam: any;

  createForm: FormGroup;
  caseForm: FormGroup;

  /* Case table */
  caseSelectedRow: Case;
  caseDS: Case[];
  caseColumn: string[] = ['caseNumber', 'typeName', 'openedDate', 'closedDate', 'subTypeName', 'priorityName', 'action'];
  caseTableControl: TableControl = new TableControl(() => { this.searchCase() });

  constructor(
    public customerService: CustomerService,
    public router: Router,
    public globals: Globals,
    private appStore: AppStore,
    public api: ApiService,
    private formBuilder: FormBuilder,
    private caseStore: CaseStore,

  ) {
    super(router, globals);
  }


  ngOnInit(): void {


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


    this.searchCase();

  }

  searchCase() {
    this.customerService.getCustomerCaseList({
      pageSize: this.caseTableControl.pageSize,
      pageNo: this.caseTableControl.pageNo,
      data: { customerId: this.customerIdParam, sortColumn: this.caseTableControl.sortColumn, sortDirection: this.caseTableControl.sortDirection }
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

}
