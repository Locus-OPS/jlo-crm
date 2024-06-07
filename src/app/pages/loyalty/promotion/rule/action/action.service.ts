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
export class ActionService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getActionList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/loyalty/promotion/getRuleActionList', param);
  }

  saveAction(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/loyalty/promotion/saveRuleAction', param);
  }

  deleteAction(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/loyalty/promotion/deleteRuleAction', param);
  }

}
