import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Caseatt } from './caseatt.model';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CaseattService {

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getCaseAttachmentListByCaseNumber(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/caseatt/getCaseAttachmentListByCaseNumber', param);
  }

  

  createCaseAttachment(file: File, caseatt: Caseatt): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file);
    }
    formdata.append('caseNumber', caseatt.caseNumber ? caseatt.caseNumber.toString() : '');
    formdata.append('caseAttId', caseatt.caseAttId ? caseatt.caseAttId.toString() : '');
    formdata.append('attachmentId', caseatt.attachmentId ? caseatt.attachmentId.toString() : '');
  
    const req = new HttpRequest('POST', this.api.getRootPath() + '/api/caseatt/createCaseAttachment', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  updateCaseAttachment(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/caseatt/updateCaseAttachment', param);
  }

  deleteCaseAttachment(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/caseatt/deleteCaseAttachment', param);
  }

}
