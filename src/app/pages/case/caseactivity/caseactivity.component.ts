import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import { Dropdown } from 'src/app/model/dropdown.model';
import { Caseactivity } from './caseactivity.model';
import { CaseactivityService } from './caseactivity.service';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { ApiResponse } from 'src/app/model/api-response.model';
import { CasedetailsComponent } from '../casedetails/casedetails.component';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { ModalUserComponent } from 'src/app/pages/common/modal-user/modal-user.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
@Component({
  selector: 'tab-caseactivity-content',
  templateUrl: './caseactivity.component.html',
  styleUrls: ['./caseactivity.component.scss'],
  standalone: true,
  imports: [SharedModule, CreatedByComponent]
})

export class CaseactivityComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() caseNumber!: string;
  //caseNumber: string;

  caseDetailcom: CasedetailsComponent;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchForm: UntypedFormGroup;
  actCreateForm: UntypedFormGroup;
  actTypeList: Dropdown[];
  actStatusList: Dropdown[];

  isUpdate = false;
  selectedRow: Caseactivity;
  dataSource: Caseactivity[];
  displayedColumns: string[] = ['activityNumber', 'typeName', 'statusName', 'createdBy', 'updatedBy', 'action'];

  caseDetailSubscription: Subscription;


  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private caseactivityService: CaseactivityService,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog,
  ) {
    super(router, globals);
    this.getCodeBook();

  }

  ngOnDestroy() {
    //this.caseDetailSubscription.unsubscribe();
  }


  getActivityListAll() {
    // console.log("getActivityListAll : " + sessionStorage.getItem('caseNumber'));

    // if(sessionStorage.getItem('caseNumber')){
    //   this.caseNumber = sessionStorage.getItem('caseNumber');
    //   this.searchForm.patchValue({ caseNumber: this.caseNumber });
    //   this.search();
    // }else{
    //   this.searchForm.patchValue({ caseNumber: null });
    // }


    // this.caseDetailSubscription = this.caseStore.getCaseDetail().subscribe(resultDetail => {
    //   if (resultDetail) {
    //     // console.log(resultDetail);
    //     this.caseNumber = resultDetail.caseNumber;
    //     this.searchForm.patchValue({ caseNumber: resultDetail.caseNumber });
    //     this.search();
    //   } else {
    //     // console.log("Create CASE > caseNumber is null");
    //     this.searchForm.reset();
    //     this.searchForm.patchValue({ caseNumber: null });
    //     this.search();
    //   }
    // });

    this.searchForm.patchValue({ caseNumber: this.caseNumber });
    this.search();

  }

  ngOnInit() {
    // alert (sessionStorage.getItem('caseNumber'));

    this.searchForm = this.formBuilder.group({
      caseNumber: [this.caseNumber],
    });

    this.actCreateForm = this.formBuilder.group({
      activityNumber: [''],
      caseNumber: [this.caseNumber, Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      subject: ['', Validators.required],
      detail: [''],
      ownerCode: ['', Validators.required],
      deptCode: [''],
      ownerName: ['', Validators.required],
      deptName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });


    this.CHECK_FORM_PERMISSION(this.actCreateForm);
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['activityNumber', 'typeName', 'statusName', 'createdDate', 'createdBy', 'updatedBy', 'action'];
    } else {
      this.displayedColumns = ['activityNumber', 'typeName', 'statusName', 'createdDate', 'createdBy', 'updatedBy'];
    }

    this.getActivityListAll();

  }

  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };

    this.caseactivityService.getCaseActivityListByCaseNumber({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      // console.log(result.data);
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onActDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.caseactivityService.deleteCaseActivity({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Activity has been deleted.',
            });
            this.search();

          } else {
            Utils.alertError({
              text: 'Activity has not been deleted.',
            });
          }
        });
      }
    });
  }

  onActCreate() {
    this.isUpdate = false;
    this.selectedRow = {};
    this.actCreateForm.reset();

    this.actCreateForm.patchValue({ caseNumber: sessionStorage.getItem('caseNumber') });
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onActSave() {

    // console.log(this.actCreateForm.value);
    if (this.actCreateForm.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.actCreateForm.value
    };
    if (this.isUpdate) {
      response = this.caseactivityService.updateCaseActivity({
        data: param
      });
    } else {
      response = this.caseactivityService.createCaseActivity({
        data: param
      });
    }
    response.then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        // console.log(result.data);
        this.actCreateForm.patchValue(result.data);
        this.searchForm.patchValue({ caseNumber: result.data.caseNumber });

        Utils.alertSuccess({
          text: 'Activity has been saved.',
        });
        this.search();
      } else {
        Utils.alertError({
          text: 'Activity has not been saved.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Activity has not been saved.',
      });
    });

  }

  onSelectRow(row: Caseactivity) {
    this.isUpdate = true;
    this.selectedRow = row;
    this.actCreateForm.patchValue({
      ...this.selectedRow
    });
  }


  getCodeBook() {
    this.api.getMultipleCodebookByCodeType({
      data: ['ACT_TYPE', 'ACT_STATUS']
    }).then(
      result => {
        this.actTypeList = result.data['ACT_TYPE'];
        this.actStatusList = result.data['ACT_STATUS'];
      }
    );
  }


  showOwner() {

    const dialogRef = this.dialog.open(ModalUserComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actCreateForm.patchValue({ ownerCode: result.id, ownerName: result.displayName });
      }
    });
  }

}










