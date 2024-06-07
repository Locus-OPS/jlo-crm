import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-member',
  templateUrl: './show-member.component.html',
  styleUrls: ['./show-member.component.scss']
})
export class ShowMemberComponent implements OnInit {

  promotionId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.promotionId = data.promotionId;
  }

  ngOnInit() {
  }

}
