import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionManualPointService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getManualPointtList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/manualPoint/searchManualPoint', param);
  }

  saveManualPoint(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/manualPoint/saveManualPoint', param);
  }

  callEngine(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/manualPoint/callEngine', param);
  }

}
