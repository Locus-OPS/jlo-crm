import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TransactionData } from './transaction-data';
import { TransactionService } from './transaction.service';
import { ShowMoreComponent } from './show-more/show-more.component';
import { ModalShopComponent } from '../../common/modal-shop/modal-shop.component';
import { ModalMemberComponent } from '../../common/modal-member/modal-member.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/shared/base.component';
import { ModalProductComponent } from '../../common/modal-product/modal-product.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent extends BaseComponent implements OnInit {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  sortColumn: string;
  sortDirection: string;
  selectedRow: TransactionData;
  pageSize = 5;
  pageNo = 0;
  dataSource: TransactionData[];

  total = 0;
  displayedColumns: string[] = ['txnId', 'createdDate', 'program', 'cardNumber', 'memberName', 'txnType', 'txnSubType'
    , 'txnStatus', 'product', 'processedDate', 'channel', 'storeShopName', 'receiptId', 'receiptDate'];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  programList: Dropdown[];
  txnTypeList: Dropdown[];
  txnStatusList: Dropdown[];
  txnChannelList: Dropdown[];
  txnSubTypeList: Dropdown[];
  submitted = false;
  editable = false;
  created = false;
  canCancelled = false;
  isQueued = false;

  step = 0;

  constructor(private api: ApiService,
    public dialog: MatDialog,
    private txnApi: TransactionService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals, ) {

    super(router, globals);

    api.getMultipleCodebookByCodeType({
      data: ['TXN_TYPE', 'TXN_STATUS', 'TXN_CHANNEL', 'TXN_SUB_TYPE']
    }).then(
      result => {
        this.txnTypeList = result.data['TXN_TYPE'];
        this.txnStatusList = result.data['TXN_STATUS'];
        this.txnChannelList = result.data['TXN_CHANNEL'];
        this.txnSubTypeList = result.data['TXN_SUB_TYPE'];
      }
    );
    api.getProgram().then(result => { this.programList = result.data; });
  }

  get f() { return this.searchForm.controls; }
  get c() { return this.createForm.controls; }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      programId: [''],
      memberName: [''],
      txnTypeId: [''],
      txnStatusId: [''],
      cardNumber: [''],
      memberId: [''],
      cancelledTxnId: [''],
      txnId: [''],
      receiptId: [''],
      receiptDate: ['']
    });

    this.createForm = this.formBuilder.group({
      programId: [''],
      program: [''],
      cardNumber: [''],
      memberName: [''],

      requestPoint: [''],
      pointBefore: [''],
      earnPoint: [''],
      balancePoint: [''],

      txnId: [''],
      txnTypeId: [''],
      txnSubTypeId: [''],
      txnStatusId: [''],
      channelId: [''],
      cancelledTxnId: [''],
      processedDate: [''],
      processedTime: [''],
      processedDtl: [''],

      receiptId: [''],
      receiptDate: [''],
      storeShopId: [''],
      storeShopName: [''],
      storeShopTypeName: [''],
      amount: [''],
      quantity: [''],
      product: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
    this.search();

    this.createForm.disable();
    // this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search() {

    this.txnApi.getTransactionList({
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      data: {
        ...this.searchForm.value,
        receiptDate: Utils.getDateString(this.searchForm.value['receiptDate']),
        // createdDate: Utils.getDateString(this.searchForm.value['createdDate']),
        processedDate: Utils.getDateString(this.searchForm.value['processedDate']),
        sortColumn: this.sortColumn, sortDirection: this.sortDirection
      }
    }).then(result => {
      this.dataSource = result.data;
      this.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  sortData(e) {
    this.sortColumn = e.active;
    this.sortDirection = e.direction;
    this.search();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.editable = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();

  }

  onSelectRow(row: TransactionData) {
    this.isQueued = false;
    this.created = false;
    this.selectedRow = row;
    this.createForm.patchValue(row);

    this.canCancelled = (this.selectedRow.txnStatusId == 'PROCESSED' && this.selectedRow.txnSubTypeId != 'CANCELLATION')?true:false;

    // if (this.createForm.get('createdDate').value != null && this.createForm.get('createdDate').value !== '') {
    //   const createdDate = new Date(Utils.getStringForDate(this.createForm.get('createdDate').value.substring(0, 10)));
    //   this.createForm.get('createdDate').setValue(createdDate);
    // }

    if (this.createForm.get('processedDate').value != null && this.createForm.get('processedDate').value !== '') {
      const processedDate = new Date(Utils.getStringForDate(this.createForm.get('processedDate').value.substring(0, 10)));
      this.createForm.get('processedDate').setValue(processedDate);
    }

    if (this.createForm.get('receiptDate').value != null && this.createForm.get('receiptDate').value !== '') {
      const receiptDate = new Date(Utils.getStringForDate(this.createForm.get('receiptDate').value.substring(0, 10)));
      this.createForm.get('receiptDate').setValue(receiptDate);
    }
    if(row.txnStatusId == 'QUEUED'){
      this.isQueued = true;
    }
  }
  cancelTransaction(){
    const param = {
      txnId : this.createForm.value.txnId
    };
    this.txnApi.cancelTransaction({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        this.canCancelled = (result.data.txnStatusId == 'PROCESSED' && result.data.txnSubTypeId != 'CANCELLATION')?true:false;;
        Utils.alertSuccess({
          title: 'Cancelled!',
          text: 'Transaction has been cancelled.!' ,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Transaction has been created.!' : 'Transaction has been updated.';
    const param = {
      ...this.createForm.value
    };

    if (this.createForm.invalid) {
      return;
    }
    this.txnApi.saveTransaction({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        //Utils.setDatePicker(this.createForm);
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  clear() {
    this.searchForm.reset();
    // this.clearSort();
    // this.selectedRow = null;
  }

  onPage(event) {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  showMore() {
    const dialogRef = this.dialog.open(ShowMoreComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: { txnId: this.selectedRow.txnId }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  showCardList() {
    const dialogRef = this.dialog.open(ModalMemberComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue(result);
      }
    });
  }

  showShopList() {
    const dialogRef = this.dialog.open(ModalShopComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue({ storeShopId: result.shopId, storeShopType: result.shopTypeName });
      }
    });
  }

  showProductList() {
    const dialogRef = this.dialog.open(ModalProductComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(data => {
      this.createForm.controls['product'].setValue(data.item);
    });
  }

  callEngine(){
    const param = {txnId : this.selectedRow.txnId}
    this.txnApi.callEngine({
      data: param
    }).then(result => {
      if (result.status) {
        this.created = false;
        this.isQueued = result.data.txnStatusId == 'QUEUED' ? true : false;

        this.canCancelled = (result.data.txnStatusId == 'PROCESSED' && result.data.txnSubTypeId != 'CANCELLATION') ? true : false;
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        this.createForm.disable();
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
