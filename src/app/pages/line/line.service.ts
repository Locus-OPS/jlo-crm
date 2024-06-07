import { ApiService } from 'src/app/services/api.service';
import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { LineRedemptionReward } from './line.model';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  keepReward: LineRedemptionReward;

  constructor(
    private api: ApiService
  ) { }

  register(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/line/register', param);
  }

  checkMemberRegister(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/line/checkLineRegister', param);
  }

  getMemberInfo(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/line/getMemberInfo', param);
  }

  searchReward(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/line/searchReward', param);
  }

  submitRedeem(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/line/submitRedeem', param);
  }

  getRedeemHistory(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/line/getRedeemHistory', param);
  }

  /*****************************************************/

  setReward(reward: LineRedemptionReward) {
    this.keepReward = reward;
  }

  getReward() {
    return this.keepReward;
  }

  /*****************************************************/

}
