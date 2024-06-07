import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import Utils from 'src/app/shared/utils';
import { RewardService } from './reward.service';
import { TableControl } from 'src/app/shared/table-control';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ShowMoreComponent } from './show-more/show-more.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ProductService } from '../product/product.service';
import { RewardData } from './reward-model';
import { RewardStore } from './reward.store';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: RewardData;
  dataSource: RewardData[];

  total = 0;
  displayedColumns: string[] = ['productCode', 'product', 'campaign', 'rewardType', 'category', 'subCategory', 'startDate'
    , 'endDate', 'activeFlag'];

  searchForm: FormGroup;
  createForm: FormGroup;

  rewardTypeList: Dropdown[];
  allCampaignList: Dropdown[];
  activeCampaignList: Dropdown[];
  programList: Dropdown[];
  rewardActiveFlagList: Dropdown[];

  rewardCategoryList: Dropdown[];
  rewardSubCategoryList: Dropdown[];
  rewardOriginalSubCategoryList: Dropdown[];


  selectedFiles: FileList;
  imageSrc: string;
  uploadProgress = 0;

  submitted = false;
  editable = false;
  created = false;
  deleted = false;
  isShowMoreTab = false;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    public rewardApi: RewardService,
    public rewardStore: RewardStore,
    public productService: ProductService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCampaign().then(result => {
      this.allCampaignList = result.data;
      this.activeCampaignList = result.data.filter((item) => item.activeFlag === "Y");
    });
    api.getProgram().then(result => { this.programList = result.data; });

    api.getMultipleCodebookByCodeType({
      data: ['REWARD_TYPE', 'ACTIVE_FLAG', 'REWARD_CATEGORY', 'REWARD_SUB_CATEGORY']
    }).then(
      result => {
        this.rewardTypeList = result.data['REWARD_TYPE'];
        this.rewardActiveFlagList = result.data['ACTIVE_FLAG'];
        this.rewardCategoryList = result.data['REWARD_CATEGORY'];
        this.rewardOriginalSubCategoryList = result.data['REWARD_SUB_CATEGORY'];
      }
    );
  }

  get sf() { return this.searchForm.controls; }
  get cf() { return this.createForm.controls; }

  ngOnInit() {

    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }

    this.rewardSubCategoryList = [];

    this.searchForm = this.formBuilder.group({
      productCode: [''],
      product: [''],
      rewardType: [''],
      campaignId: [''],
    });

    this.createForm = this.formBuilder.group({
      productId: [''],
      programId: ['', Validators.required],
      previousProductCode: [''],
      productCode: ['', Validators.required],
      product: ['', Validators.required],
      rewardActiveFlag: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      rewardTypeId: ['', Validators.required],
      campaignId: ['', Validators.required],
      rewardCategoryId: ['', Validators.required],
      rewardSubCategoryId: ['', Validators.required],
      rewardPrice: ['', [Validators.required, Validators.min(0)]],
      rewardUnitPerson: ['', [Validators.required, Validators.min(0)]],
      rewardTax: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      productDetail: [''],
      rewardChannelWebPortalFlag: [''],
      rewardChannelLineFlag: [''],
      rewardChannelMobileFlag: [''],
      rewardChannelKiosFlag: [''],
      rewardChannelGiftFlag: [''],
      isGiftCardFlag: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
    this.search();
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.rewardApi.getRewardList({
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

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.isShowMoreTab = false;
    if (this.selectedRow == null) {
      this.selectedRow = {};
    }
    this.rewardSubCategoryList = [];
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  cancel() {
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.created = false;
    if (this.selectedRow == {}) {
      this.selectedRow = null;
    }
    this.onSelectRow(this.selectedRow);
  }

  onSelectRow(row) {
    this.created = false;
    this.selectedRow = row;
    Utils.setDatePicker(this.createForm);
    this.rewardSubCategoryList = this.rewardOriginalSubCategoryList.filter((cat) => cat.parentId === this.selectedRow.rewardCategoryId);
    this.createForm.patchValue(row);
    this.createForm.patchValue({ 'previousProductCode':  this.createForm.value['productCode']});
    Utils.setDatePicker(this.createForm);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelWebPortalFlag');
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelLineFlag');
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelMobileFlag');
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelKiosFlag');
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'isGiftCardFlag');

    this.rewardStore.selectReward(this.selectedRow);
  }

  onSave(e) {

    if (this.createForm.invalid) {
      return;
    }

    let previousProductCode = this.createForm.value['previousProductCode'];
    let productCode = this.createForm.value['productCode'];

    if (previousProductCode == productCode) {
      this.save(e);
    } else {
      const param = {
        preciseProductCode : productCode
      };
      this.rewardApi.getRewardListWithoutPaging({
        data: param
      }).then(result => {
        if (result.status) {
          if (result.data.length == 0) {
            this.save(e);
          } else {
            Utils.alertError({
              text: 'Cannot save this reward becuse reward code ' + productCode + " is existed.",
            });
          }
        } else {
          console.log("Error: " + result.message);
          Utils.alertError({
            text: 'Please, try again later',
          });
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later',
        });
      });
    }
  }

  save(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Reward has been created.!' : 'Reward has been updated.';
    const param = {
      ...this.createForm.value
      // This should be in Utils.
      , startDate: Utils.getDateString(this.createForm.value['startDate'])
      , endDate: Utils.getDateString(this.createForm.value['endDate'])
      , rewardChannelWebPortalFlag: Utils.convertToYN(this.createForm.value['rewardChannelWebPortalFlag'])
      , rewardChannelLineFlag: Utils.convertToYN(this.createForm.value['rewardChannelLineFlag'])
      , rewardChannelMobileFlag: Utils.convertToYN(this.createForm.value['rewardChannelMobileFlag'])
      , rewardChannelKiosFlag: Utils.convertToYN(this.createForm.value['rewardChannelKiosFlag'])
      , isGiftCardFlag: Utils.convertToYN(this.createForm.value['isGiftCardFlag'])
    };
    this.rewardApi.saveReward({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        this.createForm.patchValue({ 'previousProductCode':  this.createForm.value['productCode']});
        Utils.setDatePicker(this.createForm);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelWebPortalFlag');
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelLineFlag');
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelMobileFlag');
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'rewardChannelKiosFlag');
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'isGiftCardFlag');

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        this.created = false;
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = <string>reader.result;

      reader.readAsDataURL(file);
    }
  }

  upload() {
    this.uploadProgress = 0;
    this.rewardApi.uploadRewardImage(this.selectedFiles.item(0), this.selectedRow.productId).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        if (event.status === 200) {
          Utils.alertSuccess({
            title: 'Uploaded!',
            text: 'Reward image has been updated.',
          });
          this.selectedRow.productImgPath = <string>event.body;
        } else {
          Utils.alertError({
            text: 'Please, try later again. ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        }
        this.uploadProgress = 0;
        this.imageSrc = null;
      }
    });
    this.selectedFiles = null;
  }

  onChangeParentCategory(parentValue) {
    this.createForm.patchValue({ rewardSubCategoryId: '' });
    this.rewardSubCategoryList = this.rewardOriginalSubCategoryList.filter((cat) => cat.parentId === parentValue);
  }

  onStartDateChange(e) {
    if (this.createForm.controls['endDate'].value < e.value) {
      this.createForm.patchValue({ endDate: e.value });
    }
  }

  onEndDateChange(e) {
    if (this.createForm.controls['startDate'].value > e.value) {
      this.createForm.patchValue({ startDate: e.value });
    }
  }

  showMore() {
    this.isShowMoreTab = !this.isShowMoreTab;
    // const dialogRef = this.dialog.open(ShowMoreComponent, {
    //   height: '85%',
    //   width: '80%',
    //   panelClass: 'my-dialog',
    //   data: { productId: this.selectedRow.productId }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  onDelete(element: RewardData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.productService.deleteProduct({
          data: {
            productId: element.productId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Reward', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search();
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }
}
