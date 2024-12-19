import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { WorkflowSystemService } from '../workflow-system.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-workflow-system-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workflow-system-detail.component.html',
  styleUrl: './workflow-system-detail.component.scss'
})
export class WorkflowSystemDetailComponent extends BaseComponent implements OnInit {
  createForm: FormGroup;
  systemId: any;
  mode: String = "ADD";
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals,
    private workflowSystemService: WorkflowSystemService
  ) {
    super(router, globals);
  }
  ngOnInit() {
    const params = this.route.firstChild.snapshot.params;
    const { systemId } = params;
    this.initForm();
    if (systemId != null) {
      this.systemId = systemId;
      this.mode = "EDIT";
      this.getWfSystemDetail();
    } else {
      this.mode = "ADD";
    }
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      systemId: [""],
      systemName: ["", Validators.required],
      description: [""],
      isActive: ["Active", Validators.required]
    });
  }

  getWfSystemDetail() {
    this.workflowSystemService.getWfsystemDetail({ data: { systemId: this.systemId } }).then((res) => {
      if (res.status) {
        this.createForm.patchValue(res.data);
      }
    })
  }

  onSaveWfSystem() {
    if (this.createForm.invalid) {
      return;
    }
    if (this.mode == "ADD") {
      this.createWfsystem();
    } else {
      this.updateWfsystem();
    }
  }

  createWfsystem() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowSystemService.createWfSystem({ data: param }).then((res) => {
            if (res.status) {
              this.createForm.patchValue({ ...res.data });
              Utils.alertSuccess({ text: "Workflow system has been created." });
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

  updateWfsystem() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowSystemService.updateWfSystem({ data: param }).then((res) => {
            if (res.status) {
              this.createForm.patchValue({ ...res.data });
              Utils.alertSuccess({ text: "Workflow system has been updated." });
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

  inActiveWfSystem() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createForm.getRawValue();
          this.workflowSystemService.updateWfSystem({ data: { ...param, isActive: 'Inactive' } }).then((res) => {
            if (res.status) {
              this.createForm.patchValue({ ...res.data });
              Utils.alertSuccess({ text: "Workflow system has been Inactivated." });
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
