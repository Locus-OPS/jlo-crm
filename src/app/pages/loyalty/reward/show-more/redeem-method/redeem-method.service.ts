import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RedeemMethodService {

  constructor(
    private api: ApiService
  ) { }

  getRedeemMethodList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/reward/getRedeemMethodList', param);
  }

  saveRedeemMethod(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/saveRedeemMethod', param);
  }

  deleteRedeemMethod(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/deleteRedeemMethod', param);
  }
}
