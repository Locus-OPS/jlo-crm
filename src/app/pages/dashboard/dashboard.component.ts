import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ConsultingService } from '../consulting/consulting.service';
import { Dropdown } from 'src/app/model/dropdown.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

  searchForm: FormGroup;

  summaryCaseStatusData = [
    {
      "name": "New",
      "value": 5,
    },
    {
      "name": "Working",
      "value": 10,
    },
    {
      "name": "Escalated",
      "value": 3,
    },
    {
      "name": "Closed",
      "value": 18,
    },
  ];

  summaryCaseChannelData = [
    {
      "name": "Phone",
      "value": 16,
    },
    {
      "name": "Email",
      "value": 4,
    },
    {
      "name": "Web",
      "value": 8,
    },
    {
      "name": "Walk In",
      "value": 5,
    },
    {
      "name": "Line",
      "value": 8,
    },
    {
      "name": "Facebook",
      "value": 5,
    },
  ];

  summaryCaseTypeData = [
    {
      "name": "Incident",
      "value": 4,
    },
    {
      "name": "Service Request",
      "value": 20,
    },
  ];

  ViewByList: Dropdown[];

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType(
      { data: ['VIEW_BY'] }
    ).then(result => {
      this.ViewByList = result.data['VIEW_BY'];

    });

  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      viewBy: [""],
      consultingNumber: [""]
    });


  }

  ngAfterViewInit(): void {

  }

}
