import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';

@Component({
  selector: 'app-workflow-business-rule',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workflow-business-rule.component.html',
  styleUrl: './workflow-business-rule.component.scss'
})
export class WorkflowBusinessRuleComponent extends BaseComponent implements OnInit {

  tableControl: TableControl = new TableControl(() => { this.onSearch(); });
  datasource: any[];
  displayedColumns: string[] = ['ruleId', 'conditionType', 'conditionValue1', 'conditionValue2', 'priority', 'status', 'action'];

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
  }

  onSearch() {

  }

}
