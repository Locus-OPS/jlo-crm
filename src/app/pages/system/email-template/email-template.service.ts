import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { EmailTemplateModel } from './email-template.model';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getEmailTemplateList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/email-template/getEmailTemplateList', param);
  }

  getEmailTemplateByModule(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email-template/getEmailTemplateByModule', param);
  }

  deleteEmailTemplate(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email-template/deleteEmailTemplate', param);
  }


  saveEmailTemplate(file: File, emailTemplate: EmailTemplateModel): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file);
    }
    formdata.append('id', emailTemplate.id ? emailTemplate.id.toString() : '');
    formdata.append('attId', emailTemplate.attId ? emailTemplate.attId.toString() : '');
    formdata.append('templateName', emailTemplate.templateName ? emailTemplate.templateName.toString() : '');
    formdata.append('statusCd', emailTemplate.statusCd ? emailTemplate.statusCd.toString() : '');
    formdata.append('module', emailTemplate.module ? emailTemplate.module.toString() : '');
    formdata.append('description', emailTemplate.description ? emailTemplate.description.toString() : '');
    formdata.append('templateHtmlCode', emailTemplate.templateHtmlCode ? emailTemplate.templateHtmlCode.toString() : '');

    const req = new HttpRequest('POST', this.api.getRootPath() + '/api/email-template/saveEmailTemplate', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);

  }



}
