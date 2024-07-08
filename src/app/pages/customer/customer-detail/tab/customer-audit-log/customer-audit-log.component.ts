import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CustomerService } from '../../../customer.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { AppStore } from 'src/app/shared/app.store';
import { TableControl } from 'src/app/shared/table-control';
import { ChangeLog } from 'src/app/model/change-log.model';

@Component({
  selector: 'app-customer-audit-log',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-audit-log.component.html',
  styleUrl: './customer-audit-log.component.scss'
})
export class CustomerAuditLogComponent extends BaseComponent implements OnInit {

  @Input() customerIdParam: any;
  /* change log table */
  chSelectedRow: ChangeLog;
  changeLogDS: ChangeLog[];
  changeLogColumn: string[] = ['changedBy', 'changedDetail', 'changedDate'];
  changeLogTableControl: TableControl = new TableControl(() => { this.searchChangeLog() });

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

  ngOnInit(): void {


  }

  searchChangeLog() {

  }

}
