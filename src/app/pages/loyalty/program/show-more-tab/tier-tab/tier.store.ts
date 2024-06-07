import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TierData } from './tier-data';

@Injectable({
  providedIn: 'root'
})
export class TierStore {

  private tierSubject = new BehaviorSubject<TierData>(null);

  getTier(): Observable<TierData> {
    return this.tierSubject.asObservable();
  }

  updateTier(tier: TierData) {
    this.tierSubject.next(tier);
  }

}
