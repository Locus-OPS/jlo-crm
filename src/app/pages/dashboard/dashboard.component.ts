import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

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

  ngOnInit() {

  }

  ngAfterViewInit(): void {

  }

}
