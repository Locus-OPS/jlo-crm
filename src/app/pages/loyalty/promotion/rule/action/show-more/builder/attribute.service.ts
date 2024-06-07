import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(
    private api: ApiService
  ) { }

  getAttrGroup(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/selector/getAttrGroup', param);
  }

  getAttr(param:  ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/selector/getAttr', param);
  }

  getPointType(param:  ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/selector/getPointType', param);
  }
/*
  saveAttribute(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/loyalty/program/saveAttribute', param);
  } */

}
