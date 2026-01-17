import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStore } from 'src/app/shared/app.store';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';

@Component({
    selector: 'app-customer-audit-log',
    imports: [SharedModule],
    templateUrl: './customer-audit-log.component.html',
    styleUrl: './customer-audit-log.component.scss'
})
export class CustomerAuditLogComponent extends BaseComponent implements OnInit {

  @Input() customerIdParam: any;
  /* change log table */
  selectedRow: any;
  dataSource: any[];
  displayedColumns: string[] = ['id', 'createdByName', 'fieldName', 'changedDetail', 'createdDate'];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  searchForm: FormGroup;

  constructor(
    public customerService: CustomerService,
    public router: Router,
    public globals: Globals,
    private appStore: AppStore,
    public api: ApiService,
    private formBuilder: FormBuilder,
  ) {
    super(router, globals);

  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      customerId: [this.customerIdParam]
    });

    this.search();
  }


  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;

    this.searchForm.patchValue({
      customerId: this.customerIdParam

    });
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.customerService.getCustomerAuditLogList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'กรุณาลองใหม่ภายหลัง',
      });
    });
  }

  onSelectRow(row: any) {
    this.selectedRow = row;
  }


}
