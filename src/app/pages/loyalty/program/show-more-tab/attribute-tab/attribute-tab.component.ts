import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { AttributeTabData } from './attribute-tab-data';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { AttributeTabService } from './attribute-tab.service';
import Utils from 'src/app/shared/utils';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ProgramStore } from '../../program.store';
import { Subscription } from 'rxjs';
import { ProgramData } from '../../program-data';

@Component({
  selector: 'app-attribute-tab',
  templateUrl: './attribute-tab.component.html',
  styleUrls: ['./attribute-tab.component.scss']
})
export class AttributeTabComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableControl: TableControl = new TableControl(() => { this.searchAttr(); });

  sortColumn: string;
  sortDirection: string;
  selectedRow: AttributeTabData;
  groupDataSource: AttributeTabData[];
  dataSource: AttributeTabData[];
  groupDisplayedColumns: string[] = ['attrGroupName'];
  displayedColumns: string[] = ['attrName', 'objectName', 'fieldName', 'dataTypeName', 'attrPickList'];

  programSubscription: Subscription;
  programData: ProgramData;

  searchForm: FormGroup;
  createForm: FormGroup;

  dataTypeList: Dropdown[];
  codeTypeList: Dropdown[];
  loyaltyTableList: Dropdown[];
  columnList: Dropdown[];

  currentAttrGroupName: string;
  currentAttrGroupId: number;

  submitted = false;
  isReadOnly = false;
  created = false;
  deleted = false;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private attributeTabService: AttributeTabService,
    private programStore: ProgramStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'PROGRAM_DATA_TYPE_ATTRIBUTE' }).then(result => { this.dataTypeList = result.data; });
    api.getCodebookType().then(result => { this.codeTypeList = result.data; });
    
    this.attributeTabService.getTableList({
      data: "loy"
    }).then(result => {
      this.loyaltyTableList = result.data;
    });

    this.programSubscription = this.programStore.getProgram().subscribe(program => {
      this.clear();
      if (program) {
        this.programData = program;
        this.searchAttrGroup();
      }
    });
  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns.push('action');
    }
    this.searchForm = this.formBuilder.group({
      attrName: [''],
      objectName: [''],
      fieldName: [''],
      dataType: [''],
      attrPickList: [''],
    });

    this.createForm = this.formBuilder.group({
      attrId: [''],
      objectName: ['', Validators.required],
      attrName: ['', Validators.required],
      fieldName: ['', Validators.required],
      dataType: ['', Validators.required],
      attrPickList: [''],
      attrActiveYn: [''],
      createdDate: [''],
      createdBy: [''],
      updatedDate: [''],
      updatedBy: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  ngOnDestroy() {
    this.programSubscription.unsubscribe();
  }

  searchAttrGroup() {
    this.attributeTabService.getAttributeGroupList({
      data: this.programData.programId
    }).then(result => {
      this.groupDataSource = result.data;
      this.currentAttrGroupName = this.groupDataSource[0].attrGroupName;
      this.currentAttrGroupId = this.groupDataSource[0].attrGroupId;
      this.searchAttr();
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  searchAttr() {
    this.attributeTabService.getAttributeList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        ...this.searchForm.value,
        attrGroupId: this.currentAttrGroupId,
        sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  sortData(e) {
    this.tableControl.sortColumn = e.active;
    this.tableControl.sortDirection = e.direction;
    this.searchAttr();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
  }

  onSelectRow(row: AttributeTabData) {
    
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'attrActiveYn');
    const param = {
      ...this.createForm.value
      , programId: this.programData.programId
      , attrGroupId: this.currentAttrGroupId
      , attrActiveYn: Utils.convertToYN(this.createForm.value['attrActiveYn'])
    };
    this.attributeTabService.getColumnList({
      data: this.selectedRow.object
    }).then(result => {
      this.columnList = result.data;
    });
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Attribute has been created.!' : 'Attribute has been updated.';
    const param = {
      ...this.createForm.value
      , programId: this.programData.programId
      , attrGroupId: this.currentAttrGroupId
      , attrActiveYn: Utils.convertToYN(this.createForm.value['attrActiveYn'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.attributeTabService.saveAttribute({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'attrActiveYn');
        this.searchAttr();
        this.selectedRow = null;

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      } else {
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

  onDelete(element: AttributeTabData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.attributeTabService.deleteAttribute({
          data: {
            attrId: element.attrId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Loyalty Program Attribute', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.searchAttr();
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

  clear() {
    this.selectedRow = null;
  }

  onCancel() {
    this.selectedRow = null;
  }

  onGroupSelect(attrGroupId, attrGroupName) {
    if (this.currentAttrGroupId !== attrGroupId) {
      this.tableControl.sortColumn = '';
      this.tableControl.sortDirection = '';
      this.tableControl.pageSize = 5;
      this.tableControl.pageNo = 0;
      this.tableControl.total = 0;
      this.paginator.pageIndex = 0;
    }

    this.currentAttrGroupId = attrGroupId;
    this.currentAttrGroupName = attrGroupName;
    this.clear();
    this.searchAttr();
  }

  onObjectNameChange(objectName: Event) {
    this.attributeTabService.getColumnList({
      data: objectName
    }).then(result => {
      this.columnList = result.data;
    });
  }

  onFieldNameChange(fieldName) {
    this.attributeTabService.getColumnList({
      data: fieldName
    }).then(result => {
      let columnSelected = this.columnList.filter(dataTypeObj => dataTypeObj.codeId === fieldName)[0];
      let dbDataType = columnSelected.etc1;
      let dataType = null;
      if (dbDataType == "int" || dbDataType == "bigint" || dbDataType == "decimal") {
        dataType = "02";
      } else if (dbDataType == "varchar" || dbDataType == "text") {
        dataType = "01";
      } else if (dbDataType == "date" || dbDataType == "datetime") {
        dataType = "03";
      }
      this.createForm.patchValue({ 'dataType':  dataType});
    });
  }
}
