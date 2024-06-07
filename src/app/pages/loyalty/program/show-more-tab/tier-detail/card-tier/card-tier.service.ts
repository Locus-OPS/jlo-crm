import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CardTierService {

  constructor(
    private api: ApiService
    ) { }

    getCardTierList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
      return this.api.call('/api/loyalty/program/getCardTierList', param);
    }

    getCardTierListWithoutPaging(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/getCardTierListWithoutPaging', param);
    }

    saveCardTier(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/saveCardTier', param);
    }

    deleteCardTier(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/deleteCardTier', param);
    }

    getCardTierById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/getCardTierById', param);
    }

    getPrimaryCardTier(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/getPrimaryCardTier', param);
    }

  }
