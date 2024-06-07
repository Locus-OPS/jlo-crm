import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-action',
  templateUrl: './show-action.component.html',
  styleUrls: ['./show-action.component.scss']
})
export class ShowActionComponent implements OnInit {

  ruleId: number;
  programId: number;
  created: boolean;
  row: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ruleId = data.ruleId;
    this.programId = data.programId;
    this.created = data.created;
    this.row = data.row;
  }

  ngOnInit() {
    console.log('ruleId++++++++++++++++++++', this.ruleId);
    console.log('created++++++++++++++++++++', this.created);
    console.log('row++++++++++++++++++++', this.row);
  }
}
