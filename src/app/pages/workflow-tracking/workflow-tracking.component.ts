import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';


@Component({
  selector: 'app-workflow-tracking',
  standalone: true,
  imports: [],
  templateUrl: './workflow-tracking.component.html',
  styleUrl: './workflow-tracking.component.scss'
})
export class WorkflowTrackingComponent extends BaseComponent implements OnInit {


  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

  }

  ngOnInit(): void {


  }



}
