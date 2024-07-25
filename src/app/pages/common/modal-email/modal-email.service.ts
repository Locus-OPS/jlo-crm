import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { EmailTemplateModel } from '../../system/email-template/email-template.model';
import { Observable } from 'rxjs';
import { EmailModel } from './modal-email.model';

@Injectable({
  providedIn: 'root',
})
export class ModalEmailService {
  constructor(
    private api: ApiService,
    private http: HttpClient

  ) { }

  sendEmail(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email/sendEmail', param);


  }

  sendEmailWithAttachedFile(file: File, email: EmailModel): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file);
    }

    formdata.append('fromEmail', email.fromEmail ? email.fromEmail.toString() : '');
    formdata.append('toEmail', email.toEmail ? email.toEmail.toString() : '');
    formdata.append('ccEmail', email.ccEmail ? email.ccEmail.toString() : '');
    formdata.append('subjectEmail', email.subjectEmail ? email.subjectEmail.toString() : '');
    formdata.append('bodyEmail', email.bodyEmail ? email.bodyEmail.toString() : '');
    formdata.append('parentModule', email.parentModule ? email.parentModule.toString() : '');

    const req = new HttpRequest('POST', this.api.getRootPath() + '/api/email/sendEmailWithAttachedFile', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);

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


  sendEmailWithAtt(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email/sendEmailWithAtt', param);


  }

  sendEmailWithMultiAtt(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email/sendEmailWithMultiAtt', param);

  }


}
