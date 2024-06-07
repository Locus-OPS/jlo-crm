import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { ShopData } from './tier-shop-data';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { TierShopService } from './tier-shop.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-shop',
  templateUrl: './tier-shop.component.html',
  styleUrls: ['./tier-shop.component.scss']
})
export class TierLocationShopComponent implements OnInit {

  @Input() tierId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  displayedColumns: string[] = ['select', 'location', 'shop', 'shopType'];
  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;
  selectedRow: ShopData;

  locationList: Dropdown[];
  shopTypeList: Dropdown[];

  dataSource: any;
  selection = new SelectionModel<ShopData>(true, []);

  constructor(
    private api: ApiService,
    private tierShopService: TierShopService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TierLocationShopComponent>,
  ) {
    this.api.getCodebookByCodeType({ data: 'LOCATION_CD' }).then(result => { this.locationList = result.data; });
    this.api.getShopType().then(result => { this.shopTypeList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      locationId: [''],
      shopTypeId: [''],
      shop: ['']
    });

    this.createForm = this.formBuilder.group({
      spending: ['', Validators.required],
      point: ['', Validators.required],
      activeFlag: ['']
    });
    //this.search();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  masterToggle() {
    if (this.dataSource) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ShopData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.locationId}`;
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search() {

    const param = {
      ...this.searchForm.value
      , tierId: this.tierId
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.tierShopService.getNotSelectedShopList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = new MatTableDataSource<ShopData>(result.data);
      this.tableControl.total = result.total;
      this.selection.clear();
    }, error => {
      Utils.alertError({
        text: 'Please try again later - from location base point / shop search.',
      });
    });
    this.selectedRow = null;
  }

  onSelectRow(row) {
    this.selectedRow = row;
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  onSave(e) {
    if (this.createForm.invalid) {
      return;
    }
    const param = [];
    this.selection.selected.forEach(row => {
      param.push({
        ...this.createForm.value, tierId: this.tierId, shopId: row.shopId,
        //activeFlag: this.createForm.value['activeFlag'] === true ? 'Y' : 'N'
        activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
      })
    });
    if (param.length == 0) {
      Utils.alertError({
        text: 'Please choose at least one shop.'
      });
      return;
    }

    this.tierShopService.createLocationBasePoint({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.alertSuccess({
          title: 'Created!',
          // text: `Location Specific Shop(s) is(are) selected and saved under ${this.tierId}`
          text: `Location Specific Shop has been created.!`
        });
      } else {
        Utils.alertError({
          text: `There is a problem.
          errorCode : ${result.errorCode}
          message : ${result.message}`,
        });
      }
      this.onClose();
    }, error => {
      Utils.alertError({
        text: 'Please, try again later - from ShopService'
      });
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
