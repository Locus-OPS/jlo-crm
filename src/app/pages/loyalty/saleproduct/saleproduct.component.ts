import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { SaleproductService } from './saleproduct.service';
import { Saleproduct } from './saleproduct.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import {DropdownModel} from 'src/app/model/dropdown.model'
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-saleproduct',
  templateUrl: './saleproduct.component.html',
  styleUrls: ['./saleproduct.component.scss']
})

export class SaleproductComponent extends BaseComponent  implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });


  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  statusList: Dropdown[];
  parentCategoryList: DropdownModel[];
  categoryList: DropdownModel[];
  allCategoryList: DropdownModel[];

  isUpdate = false;
  selectedRow: Saleproduct;
  dataSource: Saleproduct[];




  displayedColumns: string[] = ['itemCode', 'itemName','statusName','categoryName', 'pricing', 'action'];

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private saleproductService: SaleproductService,
    public router: Router,
    public globals: Globals
  ) {

    super(router, globals);

    api.getMultipleCodebookByCodeType({
      data: ['ITEM_STATUS']
    }).then(
      result => {
        this.statusList = result.data['ITEM_STATUS'];
      }
    );

    api.getSaleProductCategory().then(result => {
      this.allCategoryList = result.data;
      this.parentCategoryList = this.allCategoryList.filter((cat) => cat.parentId === null);
    });

  }

   ngOnInit() {
    this.searchForm = this.formBuilder.group({
      itemName: [''],
      itemStatus: [''],
      statusList:[''],
      statusName:[''],
      categoryCode:['']

    });

    this.createForm = this.formBuilder.group({
      itemCode:  [''],
      itemName:  ['', Validators.required],
      itemStatus: ['', Validators.required],
      pricing:  ['', Validators.required],
      categoryCode :[''],
      categoryName :[''],
      buId:[''],
      unit:[''],
      remark:[''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
    });

    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
    if(this.CAN_WRITE()){
      this.displayedColumns  = ['itemCode', 'itemName','statusName','categoryName', 'pricing', 'action'];
    }else{
      this.displayedColumns  = ['itemCode', 'itemName','statusName','categoryName', 'pricing'];
    }
  }

   search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };

    this.saleproductService.getSaleProductList({
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
  }

  create() {
    this.isUpdate = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }

  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.saleproductService.deleteSaleProduct({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Sale Product has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'Sale Product has not been deleted.',
            });
          }
        });
      }
    });
  }

  onSelectRow(row) {
    this.isUpdate = true;
    this.selectedRow = row;
    this.createForm.patchValue({
      ...this.selectedRow
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.createForm.value
    };
    if (this.isUpdate) {
      response = this.saleproductService.updateSaleProduct({
        data: param
      });
    } else {
      response = this.saleproductService.createSaleProduct({
        data: param
      });
    }
    response.then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Sale Product has been saved.',
        });
        //this.search();
      } else {
        Utils.alertError({
          text: 'Sale Product has not been saved.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'SaleProduct has not been saved.',
      });
    });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

}
