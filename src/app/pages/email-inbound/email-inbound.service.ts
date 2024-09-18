import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmailInboundService {


  constructor(
    private api: ApiService
  ) { }

  getEmailInboundList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/email-inbound/getEmailInboundList', param);
  }


  getEmailInboundDetailById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email-inbound/getEmailInboundDetailById', param);
  }

  getEmailInboundAttListById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email-inbound/getEmailInboundAttListById', param);
  }

  getDocumentAttPath(filePath: string, fileName: string) {
    return this.api.getRootPath() + '/api/email-inbound/getDocumentAttPath?filePath=' + encodeURI(filePath + '/' + fileName);
  }


}
