import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { KbService } from '../../kb.service';
import Utils from 'src/app/shared/utils';
import { Subscription } from 'rxjs';
import { KbDetail } from '../../kb.model';
import { KbStore } from '../../kb.store';
import * as moment from 'moment';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TreeModalComponent } from './tree-modal/tree-modal.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/shared/base.component';

@Component({
  selector: 'kb-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @Input()
  translatePrefix: string;

  contentStatusList: Dropdown[];

  contentIconList: Dropdown[];

  createForm: UntypedFormGroup;

  kbDetailSubscription: Subscription;

  creating: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    private kbService: KbService,
    private kbStore: KbStore,
    private dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['CONTENT_STATUS', 'CONTENT_ICON']
    }).then(
      result => {
        this.contentStatusList = result.data['CONTENT_STATUS'];
        this.contentIconList = result.data['CONTENT_ICON'];
      }
    );

    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (detail) {
        this.updateFormValue(detail);
        if (detail.contentId) {
          this.creating = false;
        } else {
          this.creating = true;
        }
      }
    });
  }

  ngOnDestroy() {
    this.kbDetailSubscription.unsubscribe();
  }

  ngOnInit() {
    this.creating = false;
    this.createForm = this.formBuilder.group({
      contentId: [''],
      contentIdTemp: [''],
      catId: ['', Validators.required],
      catName: ['', Validators.required],
      title: ['', Validators.required],
      contentStatus: ['', Validators.required],
      display: ['', Validators.required],
      seq: [''],
      sendDocFlag: [''],
      startDate: ['', Validators.required],
      startTime: [''],
      endDate: ['', Validators.required],
      endTime: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  updateFormValue(detail: KbDetail) {
    this.createForm.patchValue({
      ...detail
      , sendDocFlag: detail.sendDocFlag === 'Y' ? true : false
      , startDate: moment(detail.startDate, 'DD/MM/YYYY')
      , endDate: moment(detail.endDate, 'DD/MM/YYYY')
    });
  }

  create() {
    let contentId = this.createForm.value['contentId'];
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.kbStore.updateKbDetail(null);
    this.createForm.controls['contentIdTemp'].setValue(contentId);
    this.creating = true;
  }

  cancel() {
    let contentId = this.createForm.value['contentIdTemp'];
    if (contentId) {
      this.kbStore.updateKbDetail(contentId);
    } else {
      this.createForm.reset();
      if (this.createFormDirective) {
        this.createFormDirective.resetForm();
      }
      this.creating = false;
    }
  }

  openTreeModal() {
    const dialogRef = this.dialog.open(TreeModalComponent, {
      minHeight: '85%',
      minWidth: '80%',
      panelClass: 'my-dialog',
      data: {
        catId: this.createForm.value['catId'],
        translatePrefix: this.translatePrefix
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.createForm.controls['catId'].setValue(data.id.replace('C', ''));
        this.createForm.controls['catName'].setValue(data.name);
      }
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    let result = Utils.validateDateTimeRange(this.createForm.value['startDate'], this.createForm.value['endDate'], this.createForm.value['startTime'], this.createForm.value['endTime']);
    if (!result) {
      return;
    }

    let isCreate = (!this.createForm.value['contentId']);
    this.kbService.saveKbDetail({
      data: {
        ...this.createForm.value
        , startDateTime: Utils.getDateTimeString(this.createForm.value['startDate'], this.createForm.value['startTime'])
        , startDate: null
        , startTime: null
        , endDateTime: Utils.getDateTimeString(this.createForm.value['endDate'], this.createForm.value['endTime'])
        , endDate: null
        , endTime: null
        , sendDocFlag: this.createForm.controls['sendDocFlag'].value === true ? 'Y' : 'N'
        , type: this.kbStore.getKbContentType()
        , subType: '01'
      }
    }).then(result => {
      if (result.status) {
        this.updateFormValue(result.data);
        Utils.alertSuccess({
          title: 'Updated!',
          text: 'KB has been updated.',
        });
        //if (isCreate) {
        this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
        //}
        this.creating = false;
      }
    });
  }
}