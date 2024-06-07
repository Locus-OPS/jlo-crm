import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttrService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getPromotionAttributeList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/loyalty/promotion/getPromotionAttributeList', param);
  }

  savePromotionAttribute(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/loyalty/promotion/savePromotionAttribute', param);
  }

  deletePromotionAttribute(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/loyalty/promotion/deletePromotionAttribute', param);
  }

}
