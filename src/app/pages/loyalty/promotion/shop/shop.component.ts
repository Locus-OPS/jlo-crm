import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { ShopData } from './shop.data';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder } from '@angular/forms';
import { ShopService } from './shop.service';
import Utils from 'src/app/shared/utils';
import { Router } from '@angular/router';
import { ShowShopComponent } from './show-shop/show-shop.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { PromotionData } from '../promotion.data';
import { PromotionStore } from '../promotion.store';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(this.promotionId); });


  programId: number;
  selectedRow: ShopData;
  dataSource: ShopData[];
  displayedColumns: string[] = ['shop', 'shopType', 'location', 'action'];

  promotionSubscription: Subscription;
  promotionData: PromotionData;

  created = false;
  deleted = false;

  selectedFiles: FileList;
  base64File: string;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private shopService: ShopService,
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
  ngOnDestroy(): void {
    this.promotionSubscription.unsubscribe();
  }

  ngOnInit() {
    this.search(this.promotionData.promotionId);

    if (this.CAN_WRITE()) {
      this.displayedColumns = ['shop', 'shopType', 'location', 'action'];
    } else {
      this.displayedColumns = ['shop', 'shopType', 'location'];
    }
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
    this.api.uploadShopExcelApi({
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
    this.shopService.getShopList({
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

  onDelete(element: ShopData) {
    console.log('...delete...', element);
    this.deleted = true;
    this.shopService.deleteShop({
      data: {
        promotionShopIncludedId: element.promotionShopIncludedId
      }
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.deleted, 'Promotion Shop', this.deleted);
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


  onCreate(command: string, row?: any) {
    command === 'create' ? this.created = true : this.created = false;

    const dialogRef = this.dialog.open(ShowShopComponent, {
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
