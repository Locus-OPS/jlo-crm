import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private api: ApiService
  ) { }

  getDepartmentList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/department/getDepartmentList', param);
  }

  saveDepartment(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/department/saveDepartment', param);
  }

  deleteDepartment(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/department/deleteDepartment', param);
  }

  getDepartmentTeamList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/department/getDepartmentTeamByDepartmentIdList', param);
  }

  saveDepartmentTeam(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/department/saveDepartmentTeam', param);
  }

  deleteDepartmentTeam(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/department/deleteDepartmentTeam', param);
  }

}
