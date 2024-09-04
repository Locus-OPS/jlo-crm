import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireDashboardService {
  private rootPath = environment.endpoint;
  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  //ดึงข้อมูล main dashboard
  getMainDashboard(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnairedashboard/getmaindashboard', param);
  }

  //ดึงข้อมูลแบบสอบถาม
  getRespondentList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/questionnairedashboard/getrespondentlist', param);
  }

  //ดึงข้อมูล Summary แบบ Text
  getSummaryTextList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnairedashboard/getsummaryTextList', param);
  }

  //ดึงข้อมูล Summary แบบ Text
  getQuestionResponseSummaryList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnairedashboard/getquestionresponsesummary', param);
  }


}
