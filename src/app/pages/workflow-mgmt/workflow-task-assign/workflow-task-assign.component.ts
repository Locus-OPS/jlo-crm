import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';
import { WorkflowMgmtService } from '../workflow-mgmt.service';
import { ModalUserComponent } from '../../common/modal-user/modal-user.component';
import { MatDialog } from '@angular/material/dialog';
import Utils from 'src/app/shared/utils';

@Component({
    selector: 'app-workflow-task-assign',
    imports: [SharedModule],
    templateUrl: './workflow-task-assign.component.html',
    styleUrl: './workflow-task-assign.component.scss'
})
export class WorkflowTaskAssignComponent extends BaseComponent implements OnInit {
  @Input() taskId: string = '';
  tableControl: TableControl = new TableControl(() => { this.getWfTaskAssignList() });
  datasource: any[];
  displayedColumns: string[] = ['assignmentId', 'userName', 'backupUserName', 'status', 'priority', 'duedate', 'sequence', 'action'];
  createForm: FormGroup;
  toggleOpenAddSection: boolean = true;
  selectedTaskId: any = null;
  selectedRow: any;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private workflowMgmtService: WorkflowMgmtService,
    public dialog: MatDialog,
  ) {
    super(router, globals);
  }
  ngOnInit(): void {
    this.initForm();
    this.onSearch();
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      assignmentId: [""],
      taskId: [this.taskId],
      userId: ["", Validators.required],
      userName: ["", Validators.required],
      backupUserId: [""],
      backupUserName: [""],
      assignedAt: [""],
      status: ["Pending"],
      priority: [""],
      dueDate: [""],
      sequence: [""]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskId']) {
      if (this.taskId != "") {
        this.onSearch();
      }
    }
  }


  onSearch() {
    this.tableControl.resetPage();
    this.getWfTaskAssignList();
  }

  getWfTaskAssignList() {
    this.workflowMgmtService.getWorkflowTaskAssignPageList({ data: { taskId: this.taskId }, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.datasource = res.data;
        this.tableControl.total = res.total;
      }
    });
  }

  onSaveWfTaskAssign() {
    if (this.createForm.invalid) return;
    if (this.createForm.get('assignmentId').value == "" || this.createForm.get('assignmentId').value == null) {
      this.saveWfTaskAssign();
    } else {
      this.editWfTaskAssign();
    }
  }

  saveWfTaskAssign() {
    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowMgmtService.createWorkflowTaskAssign({ data: { ...param, taskId: this.taskId } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "สร้างการมอบหมายงานสำเร็จ" });
              this.onSearch();
              this.initForm();
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  editWfTaskAssign() {
    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowMgmtService.updateWorkflowtaskAssign({ data: { ...param, taskId: this.taskId } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "อัปเดตการมอบหมายงานสำเร็จ" });
              this.onSearch();
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  onDeleteWorkflowTaskAssign(element: any) {
    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          this.workflowMgmtService.updateWorkflowtaskAssign({ data: { ...element, status: "Cancelled" } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "ลบการมอบหมายงานสำเร็จ" });
              this.onSearch();
              this.initForm();
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  onSelectedRowEdit(element) {
    //this.selectedAssignmentId = element.assignmentId;
    this.toggleOpenAddSection = true;
    this.createForm.patchValue(element);
  }

  onClearAddForm() {
    this.initForm();
  }

  onCloseAddSection() {
    this.initForm();
    this.toggleOpenAddSection = false;
  }


  showUser() {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue({
          userId: result.id,
          userName: result.displayName,
        });
      }
    });
  }

  showBackupUser() {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createForm.patchValue({
          backupUserId: result.id,
          backupUserName: result.displayName,
        });
      }
    });
  }

  onToggleOpenAddSection() {
    this.initForm();
    this.toggleOpenAddSection = !this.toggleOpenAddSection;
  }

  onRowClick(row) {
    this.selectedRow = row;
    this.onSelectedRowEdit(row);
  }
}
