import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinemsgService {
  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getRootPath() {
    return this.rootPath;
  }

  getAllLineUsers(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/linechat/getAllLineUsers', param);
  }

  getInteractionList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/linechat/getInteractionList', param);
  }

  sendMessage(params: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/linechat/sendMessage', params);
  }


  getContent(messageId: string): Promise<ApiResponse<any>> {
    return this.api.callGet(`/api/linechat/content/${messageId}`);
  }




}
