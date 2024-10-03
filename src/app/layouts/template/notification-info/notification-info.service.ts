import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationInfoService {

  constructor(private api: ApiService) { }

  getCaseNotiList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/casenoti/getcasenotilist", param);
  }

  updateReadStatus(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/casenoti/updatecasenoti", param);
  }
}
