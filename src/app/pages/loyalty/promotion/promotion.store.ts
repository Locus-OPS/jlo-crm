import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PromotionData } from './promotion.data';

@Injectable({
  providedIn: 'root'
})
export class PromotionStore {

  private promotionSubject = new BehaviorSubject<PromotionData>(null);

  selectPromotion(data: PromotionData) {
    this.promotionSubject.next(data);
  }

  getPromotion(): Observable<PromotionData> {
    return this.promotionSubject.asObservable();
  }

}
