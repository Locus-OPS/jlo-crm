import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { KbService } from 'src/app/pages/kb/kb.service';
import { KbStore } from 'src/app/pages/kb/kb.store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Dropdown } from 'src/app/model/dropdown.model';
import { Subscription } from 'rxjs';
import Utils from 'src/app/shared/utils';
import { TreeModalComponent } from 'src/app/pages/kb/component/detail/tree-modal/tree-modal.component';
import moment from 'moment';
import { KbDetail } from 'src/app/pages/kb/kb.model';

@Component({
  selector: 'modal-kb-detail',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './kb-detail.component.html',
  styleUrl: './kb-detail.component.scss'
})
export class KbDetailComponent extends BaseComponent implements OnInit, OnDestroy {

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
      catId: [''],
      catName: [''],
      title: [''],
      contentStatus: [''],
      display: [''],
      seq: [''],
      sendDocFlag: [''],
      startDate: [''],
      startTime: [''],
      endDate: [''],
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


}
