import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, FormControl } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { InternationalizationService } from './internationalization.service';
import { Internationalization } from './internationalization.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';


@Component({
  selector: 'app-internationalization',
  templateUrl: './internationalization.component.html',
  styleUrls: ['./internationalization.component.scss'],
  imports: [SharedModule]
})
export class InternationalizationComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  langList: Dropdown[];
  tmpList: string[];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  isUpdate = false;
  selectedRow: Internationalization;
  dataSource: Internationalization[];
  displayedColumns: string[] = ['msgCode', 'msgValue'];

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private internationalizationService: InternationalizationService,
    public router: Router,
    public globals: Globals,
  ) {
    super(router, globals);
    this.api.getCodebookByCodeType({ data: 'LANG' }).then(result => {
      this.langList = result.data;
    });
  }

  get formArray() {
    return this.createForm.get('langs') as UntypedFormArray;
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      msgCode: ['', Validators.required]
      , langs: this.formBuilder.array([])
    });

    this.searchForm = this.formBuilder.group({
      msgCode: [''],
      msgValue: [''],
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['msgCode', 'msgValue', 'action'];
    } else {
      this.displayedColumns = ['msgCode', 'msgValue'];
    }
  }

  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.internationalizationService.getInternationalizationList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
      if (this.dataSource.length > 0) {
        this.onSelectRow(this.dataSource[0]);
      } else {
        this.create();
      }
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

    this.formArray.clear();
    this.tmpList = [];
    this.langList.forEach(item => {
      this.tmpList.push(item.codeName);
      this.formArray.push(this.formBuilder.control('', Validators.required));
    });
  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.internationalizationService.deleteInternationalization({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Internationalization has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'Internationalization has not been deleted.',
            });
          }
        });
      }
    });
  }

  onSelectRow(row) {
    this.isUpdate = true;
    this.selectedRow = row;
    this.internationalizationService.getInternationalizationByMsgCode({
      data: {
        msgCode: row.msgCode
      }
    }).then(result => {
      if (result.status) {
        this.formArray.clear();
        this.tmpList = [];
        this.langList.forEach(item => {
          const index = result.data.findIndex(trans => trans.langCd === item.codeId);
          this.tmpList.push(item.codeName);
          this.formArray.push(this.formBuilder.control(result.data[index].msgValue, Validators.required));
        });
        this.createForm.patchValue({
          msgCode: this.selectedRow.msgCode
        });
        this.CHECK_FORM_PERMISSION(this.createForm);
      }
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    const translateList = [];
    (<[]>this.formArray.value).forEach((item, index) => {
      translateList.push({
        msgCode: this.createForm.value.msgCode
        , msgValue: item
        , langCd: this.langList[index].codeId
      });
    });
    const param = {
      previousMsgCode: this.selectedRow.msgCode
      , msgCode: this.createForm.value.msgCode
      , translateList
    };
    this.internationalizationService.saveInternationalization({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.alertSuccess({
          text: 'Internationalization has been saved.',
        });
        this.search();
      } else {
        Utils.alertError({
          text: 'Internationalization has not been saved.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Internationalization has not been saved.',
      });
    });
  }

}
