import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private api: ApiService
  ) { }

  getRoleList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/role/getRoleList', param);
  }

  saveRole(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/role/saveRole', param);
  }

  deleteRole(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/role/deleteRole', param);
  }

  getRespListByRole(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/role/getRespListByRole', param);
  }

  updateRespByRole(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/role/updateRespByRole', param);
  }
}
