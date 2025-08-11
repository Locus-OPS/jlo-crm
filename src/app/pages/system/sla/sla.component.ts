import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { CodebookService } from '../codebook/codebook.service';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { Dropdown } from 'src/app/model/dropdown.model';
import { SlaService } from './sla.service';
import Utils from 'src/app/shared/utils';

@Component({
    selector: 'app-sla',
    imports: [SharedModule, CreatedByComponent],
    templateUrl: './sla.component.html',
    styleUrl: './sla.component.scss'
})
export class SlaComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  searchForm: FormGroup;
  createForm: FormGroup;

  selectedRow: any

  sortColumn: string;
  sortDirection: string;
  displayedColumns: string[] = ['slaName', 'slaUnit', 'unit', 'statusName'];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: any[];

  pageSize = 5;
  pageNo = 0;
  total = 0;
  isUpdated = false;
  submitted = false;


  statusList: Dropdown[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private slaService: SlaService,
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.statusList = result.data; });

  }

  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      slaName: ['']
    });

    this.createForm = this.formBuilder.group({
      slaId: [''],
      slaName: ['', Validators.required],
      slaUnit: ['', Validators.required],
      statusCd: ['', Validators.required],
      desp: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: [''],
    });

    this.search();

  }


  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.slaService.getSlaList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  create() {
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.slaService.deleteSla({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'SLA has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            });
          }
        });
      }
    });
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.createForm.patchValue(this.selectedRow);
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }
    this.slaService.saveSla({
      data: {
        ...this.createForm.value
      }
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'SLA has been saved.',
        });
        this.search();
      }
    }, error => {
      Utils.alertError({
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    });
  }



}
