import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { ProductListData } from './product-list-data';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { ProductListService } from './product-list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: any;
  displayedColumns: string[] = ['select', 'item', 'parentCategory', 'category'];
  searchForm: UntypedFormGroup;
  selectedRow: ProductListData;

  parentCategoryList: Dropdown[];
  categoryList: Dropdown[];
  allCategoryList: Dropdown[];
  productList: ProductListData[];

  selection = new SelectionModel<ProductListData>(true, []);

  constructor(
    private api: ApiService,
    private productListService: ProductListService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ProductListComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: ProductData
  ) {
    this.api.getProductCategory().then(result => {
      this.allCategoryList = result.data;
      this.parentCategoryList = result.data;
    });

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      item: [''],
      parentCategoryId: [''],
      categoryId: ['']
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
    this.productListService.getAllProductList({
    pageSize: this.tableControl.pageSize,
    pageNo: this.tableControl.pageNo,
    data: param
  }).then(result => {
    this.dataSource = new MatTableDataSource<ProductListData>(result.data);
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

/* confirmSelect(){
  if (!this.selectedRow){
    Utils.alertError({ text: 'Please select a row.'});
    return;
  }
  this.dialogRef.close(this.selectedRow);
} */

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
  this.searchForm.patchValue({ categoryId: '' });
  this.categoryList = this.allCategoryList.filter((cat) => cat.parentId === parentValue);
}

/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  //console.log('isAllSelected ====================>', this.dataSource);
  if (this.dataSource) {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  //console.log('masterToggle ====================>', this.dataSource);
  if (this.dataSource) { // before search, dataSource is empty -> to prevent unnecessary error messages.
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}

/** The label for the checkbox on the passed row */
checkboxLabel(row ?: ProductListData): string {
  if (!row) {
    //console.log('xxxxxxxxxx ====================>', `${this.isAllSelected() ? 'select' : 'deselect'} all`);
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  //console.log('yyyyyyyyy ====================>', `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${ row }`);
  //console.log('xxxxxxxx========================>', row.locationId);
  //console.log('zzzzzzzzz========================>', row);

  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.itemId}`;
}

onSave(e){
  const param = [];
  this.selection.selected.forEach(row => {
    console.log('row------------------->', row);
    param.push({
      promotionId: this.promotionId,
      productCode: row.itemId
    })
  });
  if(param.length > 0){
    this.productListService.insertPromotionProduct({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.alertSuccess({
          title: 'Created!',
          text: `Products are selected and saved under ${this.promotionId}`
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
        text: 'Please, try again later - from PromotionService / Product Tab',
      });
    });
  }else{
    Utils.alertError({
      text: 'Please select product.',
    });
  }
}
}
