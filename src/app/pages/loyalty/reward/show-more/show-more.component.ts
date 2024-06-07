import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss']
})
export class ShowMoreComponent implements OnInit {

  productId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.productId = data.productId;
  }

  ngOnInit() {
  }
}
