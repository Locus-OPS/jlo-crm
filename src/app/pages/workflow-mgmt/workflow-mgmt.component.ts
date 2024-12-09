import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { WorkflowModel } from './workflow-mgmt.model';
import { TableControl } from 'src/app/shared/table-control';
import { WorkflowMgmtService } from './workflow-mgmt.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-workflow-mgmt',
  standalone: true,
  imports: [SharedModule, MatTabsModule],
  templateUrl: './workflow-mgmt.component.html',
  styleUrl: './workflow-mgmt.component.scss'
})
export class WorkflowMgmtComponent extends BaseComponent implements OnInit {

  searchForm: FormGroup;
  dataSource: WorkflowModel[];
  displayedColumns: string[] = ['workflowId', 'workflowName', 'description', 'status', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals,
    private workflowMgmtService: WorkflowMgmtService
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      workflowId: [""],
      workflowName: [""],
      description: [""],
      status: ["Active"]
    });
    this.search();
  }

  onSearch() {
    //this.tableControl.resetPage();
    this.search();
  }

  search() {
    const param = this.searchForm.getRawValue();
    this.workflowMgmtService.getWorkflowPageList({ data: param, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.dataSource = res.data;
        this.tableControl.total = res.total;
      }
    });
  }

  gotoWorkflowDetail(element: any) {
    this.router.navigate(["/workflow/workflow-mgmt-detail", { workflowId: element.workflowId }]);
  }



}
