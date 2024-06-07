import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { LocationBasePointData } from './location-base-point-data';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { LocationBasePointService } from './location-base-point.service';
import { Subscription } from 'rxjs';
import { TierLocationShowShopComponent } from './show-shop/tier-show-shop.component';
import { TierService } from '../../tier-tab/tier.service';
import { TierData } from '../../tier-tab/tier-data';
import { TierStore } from '../../tier-tab/tier.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiResponse } from 'src/app/model/api-response.model';

@Component({
  selector: 'app-location-base-point',
  templateUrl: './location-base-point.component.html',
  styleUrls: ['./location-base-point.component.scss']
})
export class LocationBasePointComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tierSubscription: Subscription;
  tierData: TierData;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: LocationBasePointData;
  dataSource: LocationBasePointData[];
  displayedColumns: string[] = ['location', 'shopType', 'shop', 'spending', 'point', 'activeFlag'];

  createForm: UntypedFormGroup;

  locationList: Dropdown[];
  submitted = false;
  created = false;
  deleted = false;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private locationBasePointService: LocationBasePointService,
    private tierService: TierService,
    public dialog: MatDialog,
    private tierStore: TierStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'LOCATION_CD' }).then(result => { this.locationList = result.data; });
    this.tierSubscription = this.tierStore.getTier().subscribe(tier => {
      if (tier) {
        this.tierData = tier;
        this.search();
      }
    });
  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }
    this.createForm = this.formBuilder.group({
      locationId: [{ value: '', disabled: true }],
      shop: [{ value: '', disabled: true }],
      spending: ['', Validators.required],
      point: ['', Validators.required],
      activeFlag: [''],
      createdDate: [''],
      createdBy: [''],
      updatedDate: [''],
      updatedBy: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);

    this.search();
  }

  ngOnDestroy() {
    this.tierSubscription.unsubscribe();
  }

  search() {
    this.locationBasePointService.getLocationBasePointList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { tierId: this.tierData.tierId, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later - from Location Base Point Service.',
      });
    });
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.showShopList();
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
  }

  onSave() {
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Location Base Point has been created.!' : 'Location Base Point has been updated.';
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.createForm.value,
      tierId: this.tierData.tierId,
      shopId: this.selectedRow.shopId,
      locationBasePointId: this.selectedRow.locationBasePointId,
      activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
    };
    if (this.created) {
      response = this.locationBasePointService.createLocationBasePoint({
        data: param
      });
    } else {
      response = this.locationBasePointService.updateLocationBasePoint({
        data: param
      });
    }

    response.then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later - from Location Base Point Service',
      });
    });
  }

  clear() {
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  showShopList() {
    const dialogRef = this.dialog.open(TierLocationShowShopComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: { tierId: this.tierData.tierId }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.search(); // to refresh
    });
  }

  onDelete(element: LocationBasePointData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.locationBasePointService.deleteLocationBasePoint({
          data: {
            locationBasePointId: element.locationBasePointId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Location Base Point', this.deleted);
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
