import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SlaService {

  constructor(
    private api: ApiService
  ) { }

  getSlaList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/sla/getSlaList', param);
  }

  saveSla(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sla/saveSla', param);
  }

  deleteSla(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/sla/deleteSla', param);
  }
}
