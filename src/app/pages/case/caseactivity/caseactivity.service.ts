import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CaseactivityService {

  constructor(
    private api: ApiService
  ) { }

  getCaseActivityListByCaseNumber(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/caseactivity/getCaseActivityListByCaseNumber', param);
  }

  createCaseActivity(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/caseactivity/createCaseActivity', param);
  }

  updateCaseActivity(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/caseactivity/updateCaseActivity', param);
  }

  deleteCaseActivity(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/caseactivity/deleteCaseActivity', param);
  }

}
