import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { MemberData } from './member.data';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder } from '@angular/forms';
import { MemberService } from './member.service';
import Utils from 'src/app/shared/utils';
import { Router } from '@angular/router';
import { ShowMemberComponent } from './show-member/show-member.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { PromotionData } from '../promotion.data';
import { PromotionStore } from '../promotion.store';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(this.promotionId); });


  programId: number;
  selectedRow: MemberData;
  dataSource: MemberData[];
  displayedColumns: string[] = ['firstName', 'lastName', 'cardNo', 'tierName', 'action'];

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
    private memberService: MemberService,
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
      this.displayedColumns = ['firstName', 'lastName', 'cardNo', 'tierName', 'action'];
    } else {
      this.displayedColumns = ['firstName', 'lastName', 'cardNo', 'tierName'];
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
    this.api.uploadMemberExcelApi({
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
    this.memberService.getMemberList({
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

  onDelete(element: MemberData) {
    console.log('...delete...', element);
    this.deleted = true;
    this.memberService.deleteMember({
      data: {
        promotionMemberId: element.promotionMemberId
      }
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.deleted, 'Promotion Member', this.deleted);
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

    const dialogRef = this.dialog.open(ShowMemberComponent, {
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
