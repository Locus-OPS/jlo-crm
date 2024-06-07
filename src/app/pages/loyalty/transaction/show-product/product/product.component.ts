import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { ProductData } from './product-data';
import { FormGroup, FormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { ProductService } from './product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  //@Input() programId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: ProductData[];
  displayedColumns: string[] = ['item', 'parentCategory', 'category'];
  searchForm: FormGroup;
  selectedRow: ProductData;

  parentCategoryList: Dropdown[];
  categoryList: Dropdown[];
  allCategoryList: Dropdown[];
  productList: ProductData[];

  constructor(
    private api: ApiService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: ProductData
    ){
    this.api.getProductCategory().then(result => {
      this.allCategoryList = result.data;
      this.parentCategoryList = this.allCategoryList.filter((cat) => cat.parentId === null);
    });

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      item: [''],
      parentCategoryId: [''],
      categoryId: ['']
    });
    //this.search();
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
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.productService.getProductList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
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

  confirmSelect(){
    if (!this.selectedRow){
      Utils.alertError({ text: 'Please select a row.'});
      return;
    }
    this.dialogRef.close(this.selectedRow);
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

  onChangeParentCategory(parentValue){
    this.searchForm.patchValue({categoryId: ''});
    this.categoryList = this.allCategoryList.filter((cat) => cat.parentId === parentValue);
  }

}
