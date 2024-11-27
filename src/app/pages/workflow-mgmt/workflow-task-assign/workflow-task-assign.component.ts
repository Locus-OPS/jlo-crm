import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'app-workflow-task-assign',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workflow-task-assign.component.html',
  styleUrl: './workflow-task-assign.component.scss'
})
export class WorkflowTaskAssignComponent extends BaseComponent implements OnInit {

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
  ) {
    super(router, globals);
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
