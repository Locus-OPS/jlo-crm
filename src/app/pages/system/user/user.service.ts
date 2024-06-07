import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private api: ApiService
  ) { }

  getUserLoginLogList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/user/getUserLoginLogList', param);
  }

  getUserList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/user/getUserList', param);
  }

  saveUser(param: ApiRequest<any>): Promise<any> {
    return this.api.call('/api/user/saveUser', param);
  }

  deleteUser(param: ApiRequest<any>): Promise<any> {
    return this.api.call('/api/user/deleteUser', param);
  }

}
