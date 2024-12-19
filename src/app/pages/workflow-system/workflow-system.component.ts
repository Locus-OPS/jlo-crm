import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { WorkflowSystemService } from './workflow-system.service';
import { TableControl } from 'src/app/shared/table-control';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-workflow-system',
  standalone: true,
  imports: [SharedModule, MatTabsModule],
  templateUrl: './workflow-system.component.html',
  styleUrl: './workflow-system.component.scss'
})
export class WorkflowSystemComponent extends BaseComponent implements OnInit {


  searchForm: FormGroup;
  dataSource: any[];
  displayedColumns: string[] = ['systemId', 'systemName', 'description', 'status', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

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

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      systemId: [""],
      systemName: [""],
      description: [""],
      isActive: ["Active"]
    });
    this.search();
  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    let param = this.searchForm.getRawValue();
    this.workflowSystemService.getWfSystemPageList({ data: param, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.dataSource = res.data;
        this.tableControl.total = res.total;
      }
    });
  }

  gotoWorkflowSystemDetail(element: any) {
    this.router.navigate(["/workflow/system-detail", { systemId: element.systemId }]);
  }
}
