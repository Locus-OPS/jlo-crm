import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { TableControl } from 'src/app/shared/table-control';
import { MatSort } from '@angular/material/sort';
import Utils from 'src/app/shared/utils';
import { ModalShopService } from './modal-shop.service';
import { ModalShopModel } from './modal-shop.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { BaseComponent } from 'src/app/shared/base.component';

@Component({
  selector: 'app-modal-shop',
  templateUrl: './modal-shop.component.html',
  styleUrls: ['./modal-shop.component.scss']
})
export class ModalShopComponent extends BaseComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  tableControl: TableControl = new TableControl(() => { this.search(); });
  
  selectedRow: ModalShopModel;
  dataSource: ModalShopModel[];
  displayedColumns: string[] = ['shopNo', 'shopName', 'shopTypeName', 'shopLocationName', 'shopFloor'];

  searchForm: FormGroup;
  shopTypeList: Dropdown[];
  locationList: Dropdown[];
  
  constructor(
      @Inject(MAT_DIALOG_DATA) public shopInfo: any,
      private dialogRef: MatDialogRef<ModalShopComponent>,
      public api: ApiService,
      private modalShopService: ModalShopService,
      private formBuilder: FormBuilder,
      public router: Router,
      public globals: Globals) { 
        super(router, globals);
        api.getShopType().then(result => { this.shopTypeList = result.data; });
        api.getMultipleCodebookByCodeType({
          data: ['LOCATION_CD']
        }).then(
          result => {
            this.locationList = result.data['LOCATION_CD'];
          }
        );
      }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      shopNo: [''],
      shopName: [''],
      shopTypeId: [''],
      shopLocation: [''],
      shopFloor: ['']
    });

    this.tableControl.sortColumn = 'shopName';
    this.tableControl.sortDirection = 'asc';
    this.search();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  clear() {
    this.searchForm.reset();
    //this.clearSort();
    this.selectedRow = null;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search(){
    this.selectedRow = null;
    this.modalShopService.getModalShopList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      console.log(result.data);
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSelectRow(row) {
    this.shopInfo = row;
    this.selectedRow = row;
  }

}