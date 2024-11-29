import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';

@Component({
  selector: 'app-workflow-task',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workflow-task.component.html',
  styleUrl: './workflow-task.component.scss'
})
export class WorkflowTaskComponent extends BaseComponent implements OnInit {
  @Input() workflowId: string = '';
  @Output() taskIdEmitter = new EventEmitter<string>();
  tableControl: TableControl = new TableControl(() => { this.onSearch(); });
  datasource: any[];
  displayedColumns: string[] = ['taskId', 'taskName', 'description', 'priority', 'status', 'action'];
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
