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
  displayedColumns: string[] = ['workflowId', 'workflowName', 'description', 'status', 'action'];
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
      workflowId: [""],
      workflowName: [""],
      description: [""],
      status: ["Active"]
    });
    this.search();
  }

  onSearch() {
    throw new Error('Method not implemented.');
  }

  search() {
  }
}