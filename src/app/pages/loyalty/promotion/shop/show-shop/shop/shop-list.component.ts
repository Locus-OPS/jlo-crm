import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { ShopListService } from './shop-list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ShopListData } from './shop-list-data';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: any;
  displayedColumns: string[] = ['select', 'shopType', 'shopName', 'locationName'];
  searchForm: UntypedFormGroup;
  selectedRow: ShopListData;

  locationList: Dropdown[];
  shopTypeList: Dropdown[];

  selection = new SelectionModel<ShopListData>(true, []);

  constructor(
    private api: ApiService,
    private shopListService: ShopListService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ShopListComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: ShopData
    ){
      api.getCodebookByCodeType({ data: 'LOCATION_CD' }).then(result => { this.locationList = result.data; });
      api.getShopType().then(result => { this.shopTypeList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      locationId: [''],
      shopTypeId: [''],
      shopName: ['']
    });

    this.search();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    const param = {
        ...this.searchForm.value
      , promotionId: this.promotionId
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.shopListService.getShopMasterList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = new MatTableDataSource<ShopListData>(result.data);
      this.tableControl.total = result.total;
      this.selection.clear();
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
    this.selectedRow = null;
  }

  onSelectRow(row) {
    this.selectedRow = row;
  }

  confirmClose(){
    this.dialogRef.close();
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if(this.dataSource){
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if(this.dataSource){ // before search, dataSource is empty -> to prevent unnecessary error messages.
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ShopListData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${ row.shopId }`;
  }

  onSave(e){
    const param = [];
    this.selection.selected.forEach(row => {
      console.log('row------------------->', row);
      param.push({
        promotionId: this.promotionId,
        locationId: row.locationId,
        shopId: row.shopId,
        shopTypeId: row.shopTypeId
      })
    });

    if(param.length > 0){
      this.shopListService.insertPromotionShop({
        data: param
      }).then(result => {
        if (result.status) {
          Utils.alertSuccess({
            title: 'Created!',
            text: `Shops are selected and saved under ${this.promotionId}`
          });
        } else {
          Utils.alertError({
            text: `There is a problem.
            errorCode : ${result.errorCode}
            message : ${result.message}`,
          });
        }
        this.confirmClose();
      }, error => {
        Utils.alertError({
          text: 'Please, try again later - from PromotionService / Shop Tab',
        });
      });
    }else{
      Utils.alertError({
        text: 'Please select shop.',
      });
    }

  }

}
