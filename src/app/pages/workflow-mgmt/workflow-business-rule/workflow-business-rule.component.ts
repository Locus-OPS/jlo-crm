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

@Component({
  selector: 'app-workflow-business-rule',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workflow-business-rule.component.html',
  styleUrl: './workflow-business-rule.component.scss'
})
export class WorkflowBusinessRuleComponent extends BaseComponent implements OnInit {
  @Input() workflowId: string = '';
  @Output() ruleIdEmitter = new EventEmitter<string>();

  tableControl: TableControl = new TableControl(() => { this.onSearch(); });
  datasource: any[];
  displayedColumns: string[] = ['ruleId', 'systemName', 'conditionType', 'conditionValue1', 'conditionValue2', 'priority', 'status', 'action'];
  toggleOpenAddSection: boolean = true;

  createform: FormGroup;
  wfId: any;
  systemList: any[] = [];
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
    this.getWorkflowSystemList();
  }

  initForm() {
    this.createform = this.formBuilder.group({
      ruleId: [""],
      workflowId: [""],
      conditionType: ["greater_than", Validators.required],
      conditionValue1: ["", Validators.required],
      conditionValue2: [""],
      priority: ["1", Validators.required],
      status: ["Active"],
      systemId: ["", Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workflowId']) {
      if (this.workflowId != "") {
        this.getBusinessRuleList();
      }
    }
  }

  onSearch() {
    this.tableControl.resetPage();
    this.getBusinessRuleList();
  }

  getBusinessRuleList() {
    this.workflowMgmtService.getBusinessRulePageList({ data: { workflowId: this.workflowId }, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.datasource = res.data;
        this.tableControl.total = res.total;
      }
    });
  }

  onSaveBusinessRule() {
    if (this.createform.invalid) return;
    if (this.createform.get("ruleId").value == "") {
      this.createBusinessRule()
    } else {
      this.editBusinessRule()
    }
  }

  createBusinessRule() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createform.getRawValue();
          this.workflowMgmtService.createBusinessRule({ data: { ...param, workflowId: this.workflowId } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Business rule has been created." });
              this.initForm();
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

  editBusinessRule() {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          const param = this.createform.getRawValue();
          this.workflowMgmtService.updateBusinessRule({ data: { ...param, workflowId: this.workflowId } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Business rule has been updated." });
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

  onDeleteBusinessRule(element: any) {
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          //const param = this.createform.getRawValue();
          this.workflowMgmtService.updateBusinessRule({ data: { ...element, workflowId: this.workflowId, status: "InActive" } }).then((res) => {
            if (res.status) {
              Utils.alertSuccess({ text: "Business rule has been deleted." });
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

  onToggleOpenAddSection() {
    this.initForm();
    this.toggleOpenAddSection = !this.toggleOpenAddSection;
  }

  onSelectedRowEdit(element: any) {
    // alert(JSON.stringify(element));
    this.toggleOpenAddSection = true;
    this.createform.patchValue(element);
    //ส่งค้าที่ user select บน grid ไปยัง parent
    this.ruleIdEmitter.emit(element.ruleId);
  }

  onCloseAddSection() {
    this.initForm();
    this.toggleOpenAddSection = false;
  }

  onClearAddForm() {
    this.initForm();
  }

  onConditionTypeChange() {
    if (this.createform.get('conditionType').value == "between") {
      this.createform.controls["conditionValue2"].setValidators(Validators.required);
    } else {
      this.createform.controls["conditionValue2"].setValidators(null);
      this.createform.patchValue({ conditionValue2: "" });
    }
  }

  getWorkflowSystemList() {
    this.workflowMgmtService.getWorkflowSystemList().then((res) => {
      if (res.status) {
        this.systemList = res.data;
      }
    });
  }

}
