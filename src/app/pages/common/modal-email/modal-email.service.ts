import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalEmailService {



  constructor(
    private api: ApiService,

  ) { }

  sendEmail(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email/sendEmail', param);


  }

  sendEmailWithAtt(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email/sendEmailWithAtt', param);


  }

  sendEmailWithMultiAtt(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/email/sendEmailWithMultiAtt', param);

  }


}
