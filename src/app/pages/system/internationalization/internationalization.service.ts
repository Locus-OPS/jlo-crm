import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class InternationalizationService {

  constructor(
    private api: ApiService
  ) { }

  getInternationalizationList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/internationalization/getInternationalizationList', param);
  }

  saveInternationalization(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/internationalization/saveInternationalization', param);
  }

  deleteInternationalization(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/internationalization/deleteInternationalization', param);
  }

  getInternationalizationByMsgCode(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/internationalization/getInternationalizationByMsgCode', param);
  }
}
