import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss']
})
export class ShowMoreComponent implements OnInit {

  txnId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.txnId = data.txnId;
  }

  ngOnInit() {
    console.log('txnId++++++++++++++++++++', this.txnId);

  }

}
