import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { RewardData } from './reward-model';

@Injectable({
  providedIn: 'root'
})
export class RewardStore {

  private rewardSubject = new BehaviorSubject<RewardData>(null);

  selectReward(data: RewardData) {
    this.rewardSubject.next(data);
  }

  getReward(): Observable<RewardData> {
    return this.rewardSubject.asObservable();
  }

}
