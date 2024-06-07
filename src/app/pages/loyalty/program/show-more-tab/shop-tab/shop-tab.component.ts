import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { ShopTabData } from './shop-tab.data';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder } from '@angular/forms';
import { ShopTabService } from './shop-tab.service';
import Utils from 'src/app/shared/utils';
import { Router } from '@angular/router';
import { ShowShopComponent } from './show-shop/show-shop.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ProgramData } from '../../program-data';
import { Subscription } from 'rxjs';
import { ProgramStore } from '../../program.store';

@Component({
  selector: 'app-shop-tab',
  templateUrl: './shop-tab.component.html',
  styleUrls: ['./shop-tab.component.scss']
})
export class ShopTabComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  programSubscription: Subscription;
  programData: ProgramData;

  tableControl: TableControl = new TableControl(() => { this.search(this.programData.programId); });

  selectedRow: ShopTabData;
  dataSource: ShopTabData[];
  displayedColumns: string[] = ['action', 'location', 'shopType', 'shop'];

  created = false;
  deleted = false;

  selectedFiles: FileList;
  base64File: string;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private shopTabService: ShopTabService,
    private programStore: ProgramStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

    this.programSubscription = this.programStore.getProgram().subscribe(program => {
      if (program) {
        this.programData = program;
        this.search(this.programData.programId);
      }
    });
  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['shop', 'shopType', 'location', 'action'];
    } else {
      this.displayedColumns = ['shop', 'shopType', 'location'];
    }
    this.search(this.programData.programId);
  }

  ngOnDestroy() {
    this.programSubscription.unsubscribe();
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
    this.api.uploadProgramShopExcelApi({
      base64File: this.base64File,
      programId: this.programData.programId
    }).then(result => {
      if (result.status) {
        Utils.showUploadSuccess(result, 'Program Shop');
        this.search(this.programData.programId);
      } else {
        Utils.showUploadError(result);
      }
    }, error => {
      console.log('error ==============================>', error);
    });
  }

  search(programId: number) {
    this.selectedRow = null;
    this.shopTabService.getShopList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        programId: programId,
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.tableControl.total = result.total;
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  onDelete(element: ShopTabData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.shopTabService.deleteShop({
          data: {
            programShopIncludedId: element.programShopIncludedId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Program Shop', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search(this.programData.programId);
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
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
        programId: this.programData.programId
        , created: this.created
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.search(this.programData.programId);
    });

  }
}
