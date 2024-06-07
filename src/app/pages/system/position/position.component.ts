import { Component, OnInit, ViewChild } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PositionService } from './position.service';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Position } from './position.model';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  posList: Dropdown[];

  selectedRow: Position;
  dataSource: Position[];
  displayedColumns: string[] = ['posId', 'posName', 'parentPosName', 'action'];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private positionService: PositionService,
    private api: ApiService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getPosition().then(result => { this.posList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      posName: [''],
      parentPosName: ['']
    });
    this.createForm = this.formBuilder.group({
      posId: [''],
      posName: ['', Validators.required],
      parentPosId: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['posId', 'posName', 'parentPosName', 'action'];
    } else {
      this.displayedColumns = ['posId', 'posName', 'parentPosName'];
    }
  }

  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.positionService.getPositionList({
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
        this.positionService.deletePosition({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Position has been deleted.',
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
    this.positionService.savePosition({
      data: {
        ...this.createForm.value
      }
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Position has been saved.',
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
