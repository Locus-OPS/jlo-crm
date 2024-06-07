import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { PrivilegeData } from './privilege.data';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { PrivilegeService } from './privilege.service';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TierData } from '../../tier-tab/tier-data';
import { Subscription } from 'rxjs';
import { TierStore } from '../../tier-tab/tier.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss']
})
export class PrivilegeComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tierSubscription: Subscription;
  tierData: TierData;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: PrivilegeData;
  dataSource: PrivilegeData[];
  displayedColumns: string[] = ['serviceName', 'serviceTypeName', 'locationName', 'unitName', 'unitValue'];

  createForm: FormGroup;

  privilegeTypeList: Dropdown[];
  locationList: Dropdown[];
  unitList: Dropdown[];

  submitted = false;
  created = false;
  deleted = false;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private privilegeService: PrivilegeService,
    private tierStore: TierStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['PRIVILEGE_TYPE_CD', 'LOCATION_CD', 'UNIT_PERIOD']
    }).then(
      result => {
        this.privilegeTypeList = result.data['PRIVILEGE_TYPE_CD'];
        this.locationList = result.data['LOCATION_CD'];
        this.unitList = result.data['UNIT_PERIOD'];
      }
    );
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
      serviceId: [''],
      programId: [''],
      tierId: [''],
      serviceName: ['', Validators.required],
      serviceType: [''],
      location: ['', Validators.required],
      unit: ['', Validators.required],
      unitValue: ['', Validators.required],
      createdDate: [],
      createdBy: [],
      updatedDate: [],
      updatedBy: []
    });

    this.CHECK_FORM_PERMISSION(this.createForm);

    this.search();
  }

  ngOnDestroy() {
    this.tierSubscription.unsubscribe();
  }

  search() {
    this.selectedRow = null;
    this.privilegeService.getPrivilegeList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        tierId: this.tierData.tierId,
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.tableControl.total = result.total;
        this.created = false;
      } else {
        this.showError(result, null);
      }
    }, error => {
      this.showError(null, error);
    });
  }

  showError(obj1, obj2) {
    if (obj1 !== null) {
      Utils.alertError({
        text: `There is a logical problem.
        errorCode : ${obj1.errorCode}
        message : ${obj1.message}`,
      });
    } else {
      Utils.alertError({
        text: `There is a problem in the server, please, try later.
        errorCode : ${obj2.errorCode}
        message : ${obj2.message}`,
      });
    }
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  cancel() {
    this.created = false;
    this.onSelectRow(this.selectedRow);
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
  }

  onSave() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.privilegeService.savePrivilege({
      data: {
        ...this.createForm.value
        , tierId: this.tierData.tierId
        , programId: this.tierData.programId
      }
    }).then(result => {
      if (result.status) {
        if (this.created) {
          this.search();
          this.createForm.reset();
          if (this.createFormDirective) {
            this.createFormDirective.resetForm();
          }
        } else {
          Utils.assign(this.selectedRow, result.data);
          this.createForm.patchValue(result.data);
        }
        this.showSuccess();
      } else {
        this.showError(result, null);
      }
    }, error => {
      console.log('error ==============================>', error);
      this.showError(null, error);
    });
  }

  showSuccess() {
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Privilege has been created.!' : 'Privilege has been updated.';
    Utils.alertSuccess({
      title: msgTitle,
      text: msgText,
    });
  }

  clear() {
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onDelete(element: PrivilegeData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.privilegeService.deletePrivilege({
          data: {
            serviceId: element.serviceId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Privilege', this.deleted);
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
