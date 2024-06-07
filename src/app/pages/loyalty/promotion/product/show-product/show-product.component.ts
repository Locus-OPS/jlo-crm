import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.scss']
})
export class ShowProductComponent implements OnInit {

  promotionId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.promotionId = data.promotionId;
  }

  ngOnInit() {
  }

}
