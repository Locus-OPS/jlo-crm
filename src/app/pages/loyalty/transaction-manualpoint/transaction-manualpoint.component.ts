import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMemberComponent } from '../../common/modal-member/modal-member.component';
import { ManualAdjustModel } from '../../loyalty/transaction-manualpoint/transaction-manualpoint.model';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { TransactionManualPointService } from '../../loyalty/transaction-manualpoint/transaction-manualpoint.service'
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-transaction-manualpoint',
  templateUrl: './transaction-manualpoint.component.html',
  styleUrls: ['./transaction-manualpoint.component.scss']
})
export class TransactionManualPointComponent extends BaseComponent implements OnInit {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  sortColumn: string;
  sortDirection: string;
  selectedRow: ManualAdjustModel;
  dataSource: ManualAdjustModel[];
  displayedColumns: string[] = ['txnId', 'status', 'memberId', 'memberName', 'cardNumber',
    'txnType', 'requestPoint', 'pointBefore', 'balancePoint', 'createdDate', 
    'createdBy', 'updatedDate', 'updatedBy'];

  
  searchForm : UntypedFormGroup;
  adjustForm : UntypedFormGroup;

  submitted = false;
  isReadOnly = false;
  isQueued = false;
  created = false;

  manualAdjustInfo : ManualAdjustModel;

  
  manualTypeList = [{codeId: 'EARN', codeName:'Additional Point' },
                 {codeId: 'BURN', codeName: 'Deduct Point' }];

  constructor(
    public api: ApiService,
    private manualPointService: TransactionManualPointService,
    public router: Router,
    public globals: Globals,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    
  ) {
    super(router, globals);
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      memberId: [''],
      txnType: [''],
      createStartDate: [''],
      createEndDate: [''],
      memberMobile: [''],
      memberFirstName: [''],
      memberLastName: [''],
      cardNumber: ['']
    });

    this.adjustForm = this.formBuilder.group({
      balancePoint: [''],
      cardNumber: [''],
      createEndDate: [''],
      createStartDate: [''],
      createdBy: [''],
      createdDate: [''],
      memberFirstName: [''],
      memberId: ['', Validators.required],
      memberLastName: [''],
      memberMobile: [''],
      memberName: [''],
      pointAdjust: ['', Validators.required],
      pointBefore: [''],
      requestPoint: [''],
      status: [''],
      txnId: [''],
      txnType: ['', Validators.required],
      updatedBy: [''],
      updatedDate: ['']
    });

    this.tableControl.sortColumn = 'txnId';
    this.tableControl.sortDirection = 'desc';
    this.search();

    this.CHECK_FORM_PERMISSION(this.adjustForm);
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = 'Created!';
    const msgText = 'Transaction has been created.';
    const param = {
      ...this.adjustForm.value
    };

    if (this.adjustForm.invalid) {
      return;
    }
    this.manualPointService.saveManualPoint({
      data: param
    }).then(result => {
      if (result.status) {
        this.created = false;
        Utils.assign(this.selectedRow, result.data);
        this.isQueued = result.data.status == 'QUEUED'?true:false;
        this.adjustForm.patchValue(result.data);
        this.adjustForm.disable();
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      }else{
        Utils.alertError({
          title: 'Warning!',
          text: result.message,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  searchMember(){
    if(this.created){
      const dialogRef = this.dialog.open(ModalMemberComponent, {
        height: '85%',
        width: '80%',
        panelClass: 'my-dialog',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.adjustForm.patchValue(result);
        }
      });
    }
  }

  search() {
    this.manualPointService.getManualPointtList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        ...this.searchForm.value,
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSelectRow(row) {
    this.isQueued = false;
    this.selectedRow = row;
    this.created = false;
    this.adjustForm.patchValue(row);
    if(row.status == 'QUEUED'){
      this.isQueued = true;
    }
    this.adjustForm.disable();
  }

  create(){
    this.created = true;
    this.submitted = false;
    this.isQueued = false;
    this.selectedRow = {};
    this.adjustForm.reset();
    this.adjustForm.patchValue({ txnType: '0'});
    this.adjustForm.enable();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onSearchDateFromChange(e) {
    if (this.searchForm.controls['createEndDate'].value < e.value) {
      this.searchForm.patchValue({ createEndDate: e.value });
    }
  }

  onSearchDateToChange(e) {
    if (this.searchForm.controls['createStartDate'].value > e.value) {
      this.searchForm.patchValue({ createStartDate: e.value });
    }
  }

  clear(){
    this.searchForm.reset();
    //this.clearSort();
    //this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  sortData(e) {
    this.tableControl.sortColumn = e.active;
    this.tableControl.sortDirection = e.direction;
    this.search();
  }

  callEngine(){
    const param = {txnId : this.selectedRow.txnId}
    this.manualPointService.callEngine({
      data: param
    }).then(result => {
      if (result.status) {
        this.created = false;
        this.isQueued = result.data.status == 'QUEUED'?true:false;
        Utils.assign(this.selectedRow, result.data);
        this.adjustForm.patchValue(result.data);
        this.adjustForm.disable();
        Utils.alertSuccess({
          title: 'Alert !',
          text: 'Call Engine Success.',
        });
      }else{
        Utils.alertError({
          title: 'Warning!',
          text: result.message,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }
}