import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { WorkflowTrackingService } from './workflow-tracking.service';


@Component({
  selector: 'app-workflow-tracking',
  standalone: true,
  imports: [],
  templateUrl: './workflow-tracking.component.html',
  styleUrl: './workflow-tracking.component.scss'
})
export class WorkflowTrackingComponent extends BaseComponent implements OnInit {


  workflows: any[] = [];
  selectedWorkflow: any | null = null;
  transactions: any[] = [];

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    private workflowTrackingService: WorkflowTrackingService
  ) {
    super(router, globals);

  }

  ngOnInit(): void {

    this.loadWorkflows();
  }

  // Load workflows
  loadWorkflows(): void {
    this.workflowTrackingService.getAllWorkflows().subscribe(
      (data) => {
        this.workflows = data;
      },
      (error) => {
        console.error('Error loading workflows:', error);
      }
    );
  }


  // Load transactions for the selected workflow
  loadTransactions(workflow: any): void {
    this.selectedWorkflow = workflow;
    this.workflowTrackingService.getTransactionsByWorkflow(workflow.id).subscribe(
      (data) => {
        this.transactions = data;
      },
      (error) => {
        console.error('Error loading transactions:', error);
      }
    );
  }

}
