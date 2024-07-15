import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  constructor(
    private api: ApiService
  ) { }

  getEmailTemplateList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/email-template/getEmailTemplateList', param);
  }

  saveEmailTemplate(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email-template/saveEmailTemplate', param);
  }

  deleteEmailTemplate(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email-template/deleteEmailTemplate', param);
  }
}
