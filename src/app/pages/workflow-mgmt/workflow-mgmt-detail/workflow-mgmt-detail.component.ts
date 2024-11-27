import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { WorkflowBusinessRuleComponent } from '../workflow-business-rule/workflow-business-rule.component';
import { WorkflowTaskComponent } from '../workflow-task/workflow-task.component';
import { WorkflowTaskAssignComponent } from '../workflow-task-assign/workflow-task-assign.component';
import Utils from 'src/app/shared/utils';
import { WorkflowMgmtService } from '../workflow-mgmt.service';

@Component({
  selector: 'app-workflow-mgmt-detail',
  standalone: true,
  imports: [SharedModule, WorkflowBusinessRuleComponent, WorkflowTaskComponent, WorkflowTaskAssignComponent],
  templateUrl: './workflow-mgmt-detail.component.html',
  styleUrl: './workflow-mgmt-detail.component.scss'
})
export class WorkflowMgmtDetailComponent extends BaseComponent implements OnInit {

  createForm: FormGroup;

  // businessRuleDatasource: any[];
  // displayedBisinessRuleColumns: string[] = ['ruleId', 'conditionType', 'conditionValue1', 'conditionValue2', 'priority', 'status', 'action'];
  workflowId: any;
  mode: any;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private route: ActivatedRoute,
    private workflowMgmtService: WorkflowMgmtService
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    const params = this.route.firstChild.snapshot.params;
    const { workflowId } = params;
    if (workflowId != 'undefinded') {
      this.workflowId = workflowId;
      this.mode = "ADD";
    } else {
      this.mode = "EDIT";
    }

    this.createForm = this.formBuilder.group({
      workflowId: [""],
      workflowName: ["", Validators.required],
      description: [""],
      status: ["Active"],
      priority: ["1"]
    });
  }

  onSaveWorkflow() {
    if (this.mode == 'ADD') {

      if (this.createForm.invalid) return;
      this.insertWorkflow();

    } else {
      this.updateWorkflow();
    }
  }

  //Insert ข้อมูล Workflow
  insertWorkflow() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowMgmtService.createWorkflow({ data: param }).then((res) => {
            if (res.status) {
              this.createForm.patchValue({ ...res.data });
              Utils.alertSuccess({ text: "Workflow has been created." });
              this.mode = 'EDIT';
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  //Update ข้อมูล Workflow
  updateWorkflow() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowMgmtService.createWorkflow({ data: param }).then((res) => {
            if (res.status) {
              this.createForm.patchValue({ ...res.data });
              Utils.alertSuccess({ text: "Workflow has been created." });
              this.mode = 'EDIT';
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }



}
