import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { ActionData } from './action.data';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ActionService } from './action.service';
import Utils from 'src/app/shared/utils';
import { ShowActionComponent } from './show-more/show-action.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent extends BaseComponent implements OnInit {

  @Input() ruleId: number;
  @Input() programId: number;
  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(this.ruleId); });



  selectedRow: ActionData;
  dataSource: ActionData[];
  displayedColumns: string[] = ['actionDetail', 'exp', 'action'];

  createForm: UntypedFormGroup;

  submitted = false;
  created = false;
  deleted = false;
  maxSeq: number;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private actionService: ActionService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
  }

  ngOnInit() {
    this.search(this.ruleId);
  }

  search(ruleId: number) {
    this.selectedRow = null;
    this.actionService.getActionList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        ruleId: ruleId,
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.tableControl.total = result.total;
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
  }


  onSelectRow(row) {
  }


  onDelete(paramActionId: number) {
    console.log('...delete...', paramActionId);
    this.deleted = true;
    this.actionService.deleteAction({
      data: {
        ruleId: this.ruleId
        , actionId: paramActionId
      }
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.deleted, 'Action', this.deleted);
      } else {
        Utils.showError(result, null);
      }
      this.search(this.ruleId);
    }, error => {
      console.log('error ==============================>', error);
      Utils.showError(null, error);
    });
  }

  clear() {
    this.createForm.reset();
  }

  showMore(command: string, row?: any) {
    command === 'create' ? this.created = true : this.created = false;

    const dialogRef = this.dialog.open(ShowActionComponent, {
      height: '80%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {
        ruleId: this.ruleId
        , programId: this.programId
        , row: row
        , created: this.created
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('...closed...');
      this.search(this.ruleId);
    });

  }
}
