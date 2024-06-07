import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-show-shop',
  templateUrl: './show-shop.component.html',
  styleUrls: ['./show-shop.component.scss']
})
export class ShowShopComponent implements OnInit {

  programId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.programId = data.programId;
  }

  ngOnInit() {
  }

}
