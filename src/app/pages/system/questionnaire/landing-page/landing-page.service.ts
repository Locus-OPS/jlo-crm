import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';
;

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  private httpClient: HttpClient;
  private clientId = 'slipdpa';
  private clientSecret = 'slipdpa123';
  private options = {
    headers: {
      Authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  constructor(
    private handler: HttpBackend,
    private api: ApiService
  ) {
    this.httpClient = new HttpClient(handler);
  }




  getLandingQuestionnaireMaster(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/landing/getLandingQuestionnaireMaster', param);
  }

  //สร้างแบบสอบถาม
  createQuestionnaire(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/landing/createquestionnaire', param);
  }



}
