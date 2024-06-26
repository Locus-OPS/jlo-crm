import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';

import { TabManageService, TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableControl } from 'src/app/shared/table-control';
import { ConsultingService } from 'src/app/pages/consulting/consulting.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-contact-history',
  templateUrl: './contact-history.component.html',
  styleUrl: './contact-history.component.scss'
})
export class ContactHistoryComponent extends BaseComponent implements OnInit {
  searchForm: FormGroup;

  @Input() customerIdParam: any;

  displayedColumns: string[] = ["consultingNumber", "channelName", "customerName", "title"
    , "statusName"
    , "startDate"
    , "endDate"
    , "consOwnerName"
    , "action"];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: any[];


  constructor(
    private tabManageService: TabManageService,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private consulting: ConsultingService,
    public router: Router,
    public globals: Globals,
    public tabParam: TabParam,
    private dialog: MatDialog,
  ) {
    super(router, globals);

  }
  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      customerId: [""]
    });

  }

  onSearch() {

    this.tableControl.resetPage();
    this.search();

  }

  search() {
    const param = {
      ...this.searchForm.getRawValue(),
      sortColumn: this.tableControl.sortColumn,
      sortDirection: this.tableControl.sortDirection,
    };

    this.consulting.getConsultingDataList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param,
    })
      .then(
        (result) => {
          this.dataSource = result.data;
          this.tableControl.total = result.total;
        },
        (error) => {
          Utils.alertError({
            text: error.message,
          });
        }
      );
  }


}  
