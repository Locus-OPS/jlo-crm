import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ConsultingService } from '../consulting/consulting.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { CaseStore } from '../case/case.store';
import Utils from 'src/app/shared/utils';
import { CaseactivityService } from '../case/caseactivity/caseactivity.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

  searchForm: FormGroup;
  searchFormCase: FormGroup;
  dataSourceSr: any[];
  displayedColumnsCase: string[] = ['caseNumber', 'typeName', 'fullName', 'subTypeName', 'priorityName', 'action'];
  tableControlCase: TableControl = new TableControl(() => { this.searchCase(); });


  tableControlAct: TableControl = new TableControl(() => { this.searchAct(); });
  dataSourceAct: any[];

  selectedRow: any[];
  displayedColumnsAct: string[] = ['activityNumber', 'typeName', 'statusName', 'createdBy', 'updatedBy', 'action'];

  summaryCaseStatusData = [
    {
      "name": "New",
      "value": 5,
    },
    {
      "name": "Working",
      "value": 10,
    },
    {
      "name": "Escalated",
      "value": 3,
    },
    {
      "name": "Closed",
      "value": 18,
    },
  ];

  summaryCaseChannelData = [
    {
      "name": "Phone",
      "value": 16,
    },
    {
      "name": "Email",
      "value": 4,
    },
    {
      "name": "Web",
      "value": 8,
    },
    {
      "name": "Walk In",
      "value": 5,
    },
    {
      "name": "Line",
      "value": 1,
    },
    {
      "name": "Facebook",
      "value": 4,
    },
  ];

  summaryCaseTypeData = [
    {
      "name": "Incident",
      "value": 4,
    },
    {
      "name": "Service Request",
      "value": 20,
    },
  ];

  ViewByList: Dropdown[];

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
    private caseactivityService: CaseactivityService,
    private consulting: ConsultingService,
    private caseStore: CaseStore,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType(
      { data: ['VIEW_BY'] }
    ).then(result => {
      this.ViewByList = result.data['VIEW_BY'];

    });

  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      viewBy: [""],
      consultingNumber: [""]
    });


  }

  ngAfterViewInit(): void {

  }



  searchCase() {
    const param = {
      ...this.searchFormCase.getRawValue(),
      sortColumn: this.tableControlCase.sortColumn,
      sortDirection: this.tableControlCase.sortDirection,
    };

    this.consulting.getCaseUnderConsultingList({
      pageSize: this.tableControlCase.pageSize,
      pageNo: this.tableControlCase.pageNo,
      data: param,
    })
      .then(
        (result) => {
          this.dataSourceSr = result.data;
          this.tableControlCase.total = result.total;
        },
        (error) => {
          Utils.alertError({
            text: error.message,
          });
        }
      );
  }

  onCaseEdit(e) {
    this.caseStore.updateCaseDetail(e.caseNumber);
  }

  searchAct() {
    //this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControlAct.sortColumn
      , sortDirection: this.tableControlAct.sortDirection
    };

    this.caseactivityService.getCaseActivityListByCaseNumber({
      pageSize: this.tableControlAct.pageSize,
      pageNo: this.tableControlAct.pageNo,
      data: param
    }).then(result => {
      // console.log(result.data);
      this.dataSourceAct = result.data;
      this.tableControlAct.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }


}
