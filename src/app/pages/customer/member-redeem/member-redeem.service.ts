import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberRedeemService {

  private memberRedeemSubmission = new BehaviorSubject<number>(null);
  
  constructor(
    private api: ApiService
  ) { }

  getMemberInfo(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/redemption/getMemberInfo', param);
  }

  searchReward(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/redemption/searchReward', param);
  }

  submitRedeem(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/redemption/submitRedeem', param);
  }

  getMemberRedeemSubmissionObservable(): Observable<number> {
    return this.memberRedeemSubmission.asObservable();
  }

  /**
   * Trigger Member detail form to reload new point information.
   * @param memberId the member ID to redeem
   */
  submitRedeemMemberId(memberId: number) {
    this.memberRedeemSubmission.next(memberId);
  }

}
