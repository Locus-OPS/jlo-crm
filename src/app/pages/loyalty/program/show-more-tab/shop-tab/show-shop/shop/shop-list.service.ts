import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ShopListService {

  constructor(
    private api: ApiService
  ) { }

  getShopMasterList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/loyalty/program/getShopMasterList', param);
  }

  insertProgramShop(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/loyalty/program/insertProgramShop', param);
  }

}
