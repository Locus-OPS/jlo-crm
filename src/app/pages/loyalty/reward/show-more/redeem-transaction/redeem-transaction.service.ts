import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';

@Injectable({
  providedIn: 'root'
})
export class RedeemTransactionService {

  constructor(
    private api: ApiService
  ) { }

  getRedemptionTransactionList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/reward/getRedemptionTransactionList', param);
  }

}
