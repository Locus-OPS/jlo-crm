import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor(
    private api: ApiService
  ) { }

  //TODO Implement function call api
  getCaseList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/case/getCaseList', param);
  }

  createCase(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/case/createCase', param);
  }

  updateCase(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/case/updateCase', param);
  }

  deleteCase(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/case/deleteCase', param);
  }

  getCaseByCaseNumber(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/case/getCaseByCaseNumber', param);
  }

  getCustomerById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/case/getCustomerById', param);
  }

  getMemberById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/case/getMemberById', param);
  }

}
