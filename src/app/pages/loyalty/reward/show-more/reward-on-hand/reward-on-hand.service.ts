import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RewardOnHandService {

  constructor(
    private api: ApiService
  ) { }

  getRewardOnHandList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/reward/getRewardOnHandList', param);
  }

  saveRewardOnHand(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/saveRewardOnHand', param);
  }

  getRewardBalance(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/getRewardBalance', param);
  }

  getRewardRedemptionTransaction(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/getRewardRedemptionTransaction', param);
  }
}
