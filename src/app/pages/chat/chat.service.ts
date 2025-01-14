import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private api: ApiService) { }

  getUserList(params: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/chatweb/getusers', params);
  }

}
