import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  constructor(
    private api: ApiService
    ) { }

    getPrivilegeList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
      return this.api.call('/api/loyalty/program/getPrivilegeList', param);
    }

    savePrivilege(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/savePrivilege', param);
    }

    deletePrivilege(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/deletePrivilege', param);
    }

    getPrivilegeById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      return this.api.call('/api/loyalty/program/getPrivilegeById', param);
    }

  }
