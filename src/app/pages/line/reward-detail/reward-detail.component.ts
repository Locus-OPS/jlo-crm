import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LineRedemptionReward } from '../line.model';
import { LineService } from '../line.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-line-reward-detail',
  templateUrl: './reward-detail.component.html',
  styleUrls: ['./reward-detail.component.scss']
})
export class LineRewardDetailComponent implements OnInit {

  reward: LineRedemptionReward;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private lineService: LineService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.reward = this.lineService.getReward();
  }

  ngOnInit() {

  }

  onBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.reward.isXcash) {
      this.router.navigate(['/line-liff/xcash-detail']);
    } else {
      this.router.navigate(['/line-liff/reward-address']);
    }
  }

}
