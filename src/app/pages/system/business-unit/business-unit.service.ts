import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {

  constructor(private api: ApiService) { }

  getBusinessUnitList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/business-unit/getBusinessUnitList', param);
  }

  createBusinessUnit(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/business-unit/createBusinessUnit', param);
  }

  updateBusinessUnit(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/business-unit/updateBusinessUnit', param);
  }

  deleteBusinessUnit(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/business-unit/deleteBusinessUnit', param);
  }
}
