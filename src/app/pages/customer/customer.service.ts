import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getCustomerList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/customer/getCustomerList', param);
  }

  getCustomerByCitizenIdOrPassportNo(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/getCustomerByCitizenIdOrPassportNo', param);
  }

  saveCustomer(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/saveCustomer', param);
  }

  getCustomerAddressList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/customer/getCustomerAddressList', param);
  }

  saveCustomerAddress(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/saveCustomerAddress', param);
  }

  deleteCustomerAddress(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/deleteCustomerAddress', param);
  }

  getCustomerAddressPrimary(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/getCustomerAddressPrimary', param);
  }

  getCustomerById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/getCustomerById', param);
  }

  updateCustomerStatus(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/updateCustomerStatus', param);
  }

  verifyRequest(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/verifyRequest', param);
  }

  verifyValidate(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/verifyValidate', param);
  }

  createMember(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/customer/createMember', param);
  }

  getCustomerCaseList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/customer/getCustomerCaseList', param);
  }
}
