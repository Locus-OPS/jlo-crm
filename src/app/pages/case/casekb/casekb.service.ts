import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CasekbService {

  constructor(private api: ApiService) { }

  getRefKBList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call("/api/caseKB/getRefKBList", param);
  }

  createRefKB(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/caseKB/createRefKB", param);
  }

  deleteRefKB(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/caseKB/deleteRefKB", param);
  }
}
