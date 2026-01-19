import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { KbStore } from '../../kb.store';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FavoriteService } from './favorite.service';

@Component({
    selector: 'kb-favorite',
    imports: [],
    templateUrl: './favorite.component.html',
    styleUrl: './favorite.component.scss'
})
export class FavoriteComponent extends BaseComponent implements OnInit {
  @Input() contentId!: number;  // รับ contentId จาก parent component
  @Input() isLiked: boolean = false;  // รับสถานะการ like เริ่มต้น
  @Output() likeToggled = new EventEmitter<{ contentId: number, liked: boolean }>();  // ส่งค่า contentId และสถานะการ like กลับไป

  kbDetailSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public globals: Globals,
    private kbStore: KbStore,
    public snackBar: MatSnackBar,
    private favoriteService: FavoriteService
  ) {
    super(router, globals);
  }

  ngOnInit(): void {
    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (detail) {
        if (detail.contentId) {
          this.contentId = detail.contentId;
          this.getKBfavorite();
        }
      }
    });
  }

  // ฟังก์ชัน toggle Like/Unlike
  toggleLike() {
    if (this.contentId != 0) {
      this.isLiked = !this.isLiked;  // เปลี่ยนสถานะ Like/Unlike
      this.createKBFavorite();
      this.likeToggled.emit({ contentId: this.contentId, liked: this.isLiked });  // ส่งค่า contentId และสถานะกลับไปยัง parent
    }
  }

  getKBfavorite() {
    this.favoriteService.getKBFavorite({ data: { contentId: this.contentId } }).then((res) => {
      if (res.status) {
        if (res.data) {
          this.isLiked = true;
        } else {
          this.isLiked = false;
        }
      }
    });
  }

  createKBFavorite() {
    this.favoriteService.createKBFavorite({ data: { contentId: this.contentId } }).then((res) => {
      if (res.status) {
        if (res.data) {
          if (res.data) {
            this.isLiked = true;
            this.openSnackBar("ถูกใจแล้ว", "ตกลง");
          }
        } else {
          this.isLiked = false;
          this.openSnackBar("ยกเลิกถูกใจ", "ตกลง");
        }
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
