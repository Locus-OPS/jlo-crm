import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss']
})
export class ShowMoreComponent implements OnInit {

  ruleId: number;
  created: boolean;
  row: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ruleId = data.ruleId;
    this.created = data.created;
    this.row = data.row;
  }

  ngOnInit() {

  }
}
