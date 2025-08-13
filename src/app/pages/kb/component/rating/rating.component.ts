import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { KbStore } from '../../kb.store';
import { RatingService } from './rating.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'kb-rating',
    imports: [SharedModule],
    templateUrl: './rating.component.html',
    styleUrl: './rating.component.scss'
})
export class RatingComponent extends BaseComponent implements OnInit {

  @Input() rating: number = 0;  // ค่าเริ่มต้นของ rating
  @Input() avgRating: number = 0;  // ค่าเริ่มต้นของ rating
  @Input() starCount: number = 5;  // จำนวนดาวทั้งหมด
  @Output() ratingUpdated = new EventEmitter<number>();  // ใช้สำหรับส่งค่า rating กลับไปยัง parent
  stars: boolean[] = Array(this.starCount).fill(false);  // สร้าง array สำหรับดาว
  contentId: number = 0;
  totalReviewer: number = 0;

  kbDetailSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public globals: Globals,
    private kbStore: KbStore,
    private ratingService: RatingService,
    public snackBar: MatSnackBar
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (detail) {
        //this.updateFormValue(detail);
        if (detail.contentId) {
          this.contentId = detail.contentId;
          this.getKBRating();
        }
      }
    });
  }

  // เมื่อคลิกที่ดาว
  rate(rating: number): void {
    if (this.contentId != 0) {
      this.rating = rating;
      this.createKBRating();
      this.ratingUpdated.emit(this.rating);  // ส่งค่า rating กลับไปยัง parent component
    }

  }

  getKBRating() {
    this.ratingService.getKBRating({ data: { contentId: this.contentId } }).then((res) => {
      if (res.status) {
        this.rating = res.data.rating;
        this.avgRating = res.data.avgRating;
        this.totalReviewer = res.data.totalReviewer;

      } else {

        console.log(res.message);
      }
    });
  }

  createKBRating() {

    this.ratingService.createKBRating({ data: { rating: this.rating, contentId: this.contentId } }).then((res) => {
      if (res.status) {
        this.rating = res.data.rating;
        this.avgRating = res.data.avgRating;
        this.totalReviewer = res.data.totalReviewer;
        this.openSnackBar("Updated Rating", "OK");
      } else {
        this.openSnackBar("Something wrong", "OK");
      }
    });
  }

  openSnackBar(message: string, action: string) {
    const config: MatSnackBarConfig = {
      duration: 2000,
      verticalPosition: 'top', // ตำแหน่งแนวตั้ง (top หรือ bottom)
      horizontalPosition: 'center' // ตำแหน่งแนวนอน (start, center หรือ end)
    };
    this.snackBar.open(message, action, config);
  }

}
