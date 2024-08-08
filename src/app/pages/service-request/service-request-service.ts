import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  constructor(
    private api: ApiService
  ) { }

  //TODO Implement function call api
  getSrList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/sr/getSrList', param);
  }

  createSr(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sr/createSr', param);
  }

  updateSr(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sr/updateSr', param);
  }

  deleteSr(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sr/deleteSr', param);
  }

  getSrBySrNumber(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sr/getSrBySrNumber', param);
  }

  getCustomerById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sr/getCustomerById', param);
  }
}
