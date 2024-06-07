import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ModalProductModel } from '../../common/modal-product/modal-product.model';
import { TableControl } from 'src/app/shared/table-control';
import { MatSort } from '@angular/material/sort';
import Utils from 'src/app/shared/utils';
import { ProductPopupService } from './product.popup.service';
import { Dropdown } from 'src/app/model/dropdown.model';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalProductComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });
  selectedRow: ModalProductModel;
  dataSource: ModalProductModel[];
  displayedColumns: string[] = ['item', 'parentCategory', 'category'];

  searchForm: FormGroup;

  parentCategoryList: Dropdown[];
  categoryList: Dropdown[];
  allCategoryList: Dropdown[];

  constructor(
      @Inject(MAT_DIALOG_DATA) public productInfo: any,
      private dialogRef: MatDialogRef<ModalProductComponent>,
      public api: ApiService,
      private productPopupService: ProductPopupService,
      private formBuilder: FormBuilder,
      public router: Router,
      public globals: Globals,) {
        this.api.getProductCategory().then(result => {
          this.allCategoryList = result.data;
          this.parentCategoryList = this.allCategoryList.filter((cat) => cat.parentId === null);
        });
      }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      item: [''],
      parentCategoryId: [''],
      categoryId: ['']
    });

    this.search();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
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
    this.productPopupService.getProductList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
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
    this.productInfo = row;
    this.selectedRow = row;
  }

  onChangeParentCategory(parentValue){
    this.searchForm.patchValue({categoryId: ''});
    this.categoryList = this.allCategoryList.filter((cat) => cat.parentId === parentValue);
  }
}
