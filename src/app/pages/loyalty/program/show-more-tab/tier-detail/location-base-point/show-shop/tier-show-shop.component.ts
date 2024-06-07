import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-shop',
  templateUrl: './tier-show-shop.component.html',
  styleUrls: ['./tier-show-shop.component.scss']
})
export class TierLocationShowShopComponent implements OnInit {

  tierId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.tierId = data.tierId;
  }

  ngOnInit() {

  }

}
