import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { PointTypeTabData } from './point-type-tab-data';
import { PointTypeTabService } from './point-type-tab.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { ProgramData } from '../../program-data';
import { ProgramStore } from '../../program.store';

@Component({
  selector: 'app-point-type-tab',
  templateUrl: './point-type-tab.component.html',
  styleUrls: ['./point-type-tab.component.scss']
})
export class PointTypeTabComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(this.programData.programId); });

  selectedRow: PointTypeTabData;
  dataSource: PointTypeTabData[];
  displayedColumns: string[] = ['pointType', 'useFor', 'expiryBasis', 'period', 'unitPeriod',
    'expiryMonth', 'expiryDay', 'primaryYn', 'activeFlag'];

  programSubscription: Subscription;
  programData: ProgramData;

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  expiryBasisList: Dropdown[];
  unitPeriodList: Dropdown[];
  expiryMonthList: Dropdown[];
  expiryDayList: Dropdown[];
  expiryDayInMonthList: Dropdown[];

  submitted = false;
  created = false;
  deleted = false;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private pointTypeTabService: PointTypeTabService,
    private programStore: ProgramStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['EXPIRY_BASIS', 'EXPIRY_DAY', 'EXPIRY_MONTH', 'UNIT_PERIOD']
    }).then(
      result => {
        this.expiryBasisList = result.data['EXPIRY_BASIS'];
        this.expiryDayList = result.data['EXPIRY_DAY'];
        this.expiryMonthList = result.data['EXPIRY_MONTH'];
        this.unitPeriodList = result.data['UNIT_PERIOD'];
        this.expiryDayInMonthList = this.expiryDayList;
      }
    );
    this.programSubscription = this.programStore.getProgram().subscribe(program => {
      this.clear(); // Reset form.
      if (program) {
        this.programData = program;
        this.search(this.programData.programId);
      }
    });
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      pointTypeId: [''],
      pointType: ['', Validators.required],
      useFor: ['', Validators.required],
      expiryBasisId: ['', Validators.required],
      unitPeriodId: ['', Validators.required],
      period: ['', Validators.required],
      expiryMonthId: [''],
      expiryDay: [''],
      activeFlag: [''],
      primaryYn: [''],
      previousPrimaryYn: [''],
      createdDate: [''],
      createdBy: [''],
      updatedDate: [''],
      updatedBy: ['']
    });
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['pointType', 'useFor', 'expiryBasis', 'period', 'unitPeriod',
        'expiryMonth', 'expiryDay', 'primaryYn', 'activeFlag', 'action'];
    } else {
      this.displayedColumns = ['pointType', 'useFor', 'expiryBasis', 'period', 'unitPeriod',
        'expiryMonth', 'expiryDay', 'primaryYn', 'activeFlag'];
    }

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  ngOnDestroy() {
    this.programSubscription.unsubscribe();
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.search(this.programData.programId);
  }

  onDelete(element: PointTypeTabData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.pointTypeTabService.deletePointType({
          data: {
            pointTypeId: element.pointTypeId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Program Shop', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search(this.programData.programId);
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

  search(programId: number) {
    this.pointTypeTabService.getPointTypeList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection,
        programId: programId
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

  onChangeExpiryBasis(event) {
    this.setExpiryBasis(event.value);
  }

  onChangeExpiryMonth(event) {
    this.filterExpiryDayInMonth(event.value);
  }

  setExpiryBasis(unitPeriodId) {
    if (unitPeriodId === '02') {
      this.createForm.controls['expiryMonthId'].reset();
      this.createForm.controls['expiryMonthId'].disable();
      this.createForm.controls['expiryDay'].reset();
      this.createForm.controls['expiryDay'].disable();
    } else {
      this.createForm.controls['expiryMonthId'].enable();
      this.createForm.controls['expiryDay'].enable();
    }
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.submitted = false;
    this.createForm.reset();
    if (!this.selectedRow) {
      this.onSelectRow({});
    }
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.createForm.patchValue({ 'previousPrimaryYn':  false});
    this.created = true;
  }

  cancel() {
    this.created = false;
    this.onSelectRow(this.selectedRow);
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'primaryYn');
    this.createForm.patchValue({ 'previousPrimaryYn':  this.createForm.value['primaryYn']});
    this.setExpiryBasis(this.createForm.value['expiryBasisId']);
    this.filterExpiryDayInMonth(this.createForm.value['expiryMonthId']);
  }

  onSave(e) {
    if (this.createForm.invalid) {
      return;
    }

    let primaryYn = this.createForm.value['primaryYn'];
    let previousPrimaryYn = this.createForm.value['previousPrimaryYn'];
    if (primaryYn && !previousPrimaryYn) {
      this.pointTypeTabService.getPrimaryPointType({
        data: {
          programId: this.programData.programId
        }
      }).then(result => {
        if (result.data) {
          let pointType = result.data.pointType;
          Utils.confirm("Warning", "Save this point type as a primary will remove primary flag from \"" + pointType + "\" point type, do you want to save this point type?", "Save Point Type").then(confirm => {
            if (confirm.value) {
              this.save(result.data.pointTypeId);
            }
          });
        } else {
          this.save(null);
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later - from Point Type Service.',
        });
      });
    } else {
      this.save(null);
    }
  }

  save(removePrimaryPointTypeId: number) {
    this.submitted = true;
    const param = {
      ...this.createForm.value,
      programId: this.programData.programId,
      activeFlag: Utils.convertToYN(this.createForm.value['activeFlag']),
      primaryYn: Utils.convertToYN(this.createForm.value['primaryYn']),
      removePrimaryPointTypeId: removePrimaryPointTypeId
    };
    this.pointTypeTabService.savePointType({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'primaryYn');
        Utils.showSuccess(this.created, 'Program PointType');
        this.search(this.programData.programId);
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clear() {
    this.selectedRow = null;
  }

  filterExpiryDayInMonth(monthId) {
    if (monthId) {
      let lastDayOfMonth = Number(this.expiryMonthList.filter(function(item) {
        return item.codeId === monthId;
      })[0].etc1);
      this.expiryDayInMonthList = this.expiryDayList.filter(item => Number(item.codeId) <= lastDayOfMonth);

      let expiryDay = this.createForm.value['expiryDay'];
      if (expiryDay > lastDayOfMonth) {
        this.createForm.controls['expiryDay'].setValue(null);
      }
    }
  }

}

