import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import Utils from 'src/app/shared/utils';
import { ProductData } from './product.data';
import { ProductService } from './product.service';
import { ShowProductComponent } from './show-product/show-product.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { PromotionData } from '../promotion.data';
import { PromotionStore } from '../promotion.store';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(this.promotionId); });

  ruleId = 0;
  programId: number;
  selectedRow: ProductData;
  dataSource: ProductData[];
  displayedColumns: string[] = ['product', 'productCategory', 'productParentCategory', 'action'];

  promotionSubscription: Subscription;
  promotionData: PromotionData;

  created = false;
  deleted = false;
  createForm: FormGroup;

  selectedFiles: FileList;
  base64File: string;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private promotionStore: PromotionStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

    this.promotionSubscription = this.promotionStore.getPromotion().subscribe(promotion => {
      // this.clear(); // Reset form.
      if (promotion) {
        this.promotionData = promotion;
        this.search(this.promotionData.promotionId);
      }
    });
  }

  ngOnInit() {
    this.search(this.promotionData.promotionId);

    if (this.CAN_WRITE()) {
      this.displayedColumns = ['product', 'productCategory', 'productParentCategory', 'action'];
    } else {
      this.displayedColumns = ['product', 'productCategory', 'productParentCategory'];
    }
  }

  ngOnDestroy() {
    this.promotionSubscription.unsubscribe();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        this.base64File = <string>reader.result;
        this.upload();
      }

      reader.readAsDataURL(file);
    }
  }

  upload() {
    console.log('...upload...');
    this.api.uploadExcelApi({
      base64File: this.base64File,
      promotionId: this.promotionId
    }).then(result => {
      if (result.status) {
        Utils.showUploadSuccess(result);
        this.search(this.promotionData.promotionId);
      } else {
        Utils.showUploadError(result);
      }
    }, error => {
      console.log('error ==============================>', error);
    });
  }

  search(promotionId: number) {
    this.selectedRow = null;
    this.productService.getProductList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        promotionId: promotionId,
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        // console.log(result.data);
        this.dataSource = result.data;
        this.tableControl.total = result.total;
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  onDelete(element: ProductData) {
    console.log('...delete...', element);
    this.deleted = true;
    this.productService.deleteProduct({
      data: {
        promotionProductId: element.promotionProductId
      }
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.deleted, 'Promotion Product', this.deleted);
      } else {
        Utils.showError(result, null);
      }
      this.search(this.promotionData.promotionId);
    }, error => {
      console.log('error ==============================>', error);
      Utils.showError(null, error);
    });
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  clear() {
    this.createForm.reset();
  }

  onCreate(command: string, row?: any) {
    command === 'create' ? this.created = true : this.created = false;

    const dialogRef = this.dialog.open(ShowProductComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {
        promotionId: this.promotionId
        , created: this.created
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('...closed...');
      this.search(this.promotionData.promotionId);
    });

  }
}
