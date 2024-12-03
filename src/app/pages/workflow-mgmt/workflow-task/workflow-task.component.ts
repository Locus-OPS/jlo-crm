import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';
import { WorkflowMgmtService } from '../workflow-mgmt.service';
import Utils from 'src/app/shared/utils';
import { WorkflowTaskAssignComponent } from '../workflow-task-assign/workflow-task-assign.component';

@Component({
  selector: 'app-workflow-task',
  standalone: true,
  imports: [SharedModule, WorkflowTaskAssignComponent],
  templateUrl: './workflow-task.component.html',
  styleUrl: './workflow-task.component.scss'
})
export class WorkflowTaskComponent extends BaseComponent implements OnInit {
  @Input() workflowId: string = '';
  @Output() taskIdEmitter = new EventEmitter<string>();
  tableControl: TableControl = new TableControl(() => { this.getWorkflowTaskList(); });
  datasource: any[];
  displayedColumns: string[] = ['taskId', 'taskName', 'description', 'priority', 'status', 'action'];
  createForm: FormGroup;
  toggleOpenAddSection: boolean = true;
  selectedTaskId: any = null;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private workflowMgmtService: WorkflowMgmtService
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workflowId']) {
      if (this.workflowId != "") {
        this.onSearch();
      }
    }
  }

  onSearch() {
    this.tableControl.resetPage();
    this.getWorkflowTaskList();
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      taskId: [""],
      taskName: ["", Validators.required],
      workflowId: [""],
      description: [""],
      status: ["Pending"],
      priority: ["", Validators.required],
      startDate: [""],
      endDate: [""]
    });
  }

  getWorkflowTaskList() {
    this.workflowMgmtService.getWorkflowTaskPageList({ data: { workflowId: this.workflowId }, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.datasource = res.data;
        this.tableControl.total = res.total;
      }
    })
  }

  onSaveWorkflowTask() {
    if (this.createForm.invalid) return;
    if (this.createForm.get('taskId').value == "" || this.createForm.get('taskId').value == null) {
      this.saveWorkflowTask();
    } else {
      this.editWorkflowTask();
    }
  }

  saveWorkflowTask() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowMgmtService.createWorkflowTask({ data: { ...param, workflowId: this.workflowId } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Workflow task has been created." });
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
    this.selectedTaskId = element.taskId;
    this.toggleOpenAddSection = true;
    this.createForm.patchValue(element);
  }

  editWorkflowTask() {

    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowMgmtService.updateWorkflowTask({ data: param }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Workflow task has been updated." });
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

  onDeleteWorkflowTask(element: any) {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          this.workflowMgmtService.updateWorkflowTask({ data: { ...element, status: "Cancelled" } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Workflow task has been deleted." });
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


  onClearAddForm() {
    this.initForm();
  }

  onToggleOpenAddSection() {
    this.initForm();
    this.toggleOpenAddSection = !this.toggleOpenAddSection;
  }

  onCloseAddSection() {
    this.initForm();
    this.toggleOpenAddSection = false;
  }





}
