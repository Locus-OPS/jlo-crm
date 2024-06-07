import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { CriteriaData } from './criteria.data';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { CriteriaService } from './criteria.service';
import Utils from 'src/app/shared/utils';
import { ShowMoreComponent } from './show-more/show-more.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent extends BaseComponent implements OnInit {

  @Input() ruleId: number;
  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(this.ruleId); });



  selectedRow: CriteriaData;
  dataSource: CriteriaData[];
  displayedColumns: string[] = ['description', 'exp', 'action'];

  createForm: UntypedFormGroup;

  submitted = false;
  created = false;
  deleted = false;
  maxSeq: number;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private criteriaService: CriteriaService,
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
    this.criteriaService.getCriteriaList({
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


  onDelete(paramCriteriaId: number) {
    this.deleted = true;
    this.criteriaService.deleteCriteria({
      data: {
        ruleId: this.ruleId
        , criteriaId: paramCriteriaId
      }
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.deleted, 'Criteria', this.deleted); /// ==> from HERE.
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

    const dialogRef = this.dialog.open(ShowMoreComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {
        ruleId: this.ruleId
        , row: row
        , created: this.created
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.search(this.ruleId);
    });

  }
}
