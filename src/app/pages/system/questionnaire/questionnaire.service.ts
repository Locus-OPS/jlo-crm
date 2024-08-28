import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
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
export class QuestionnaireService {
  private rootPath = environment.endpoint;
  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getQuestionnaireById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/getheaderquestionnairedetail', param);
  }

  createHeaderQuestionnaire(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/createHeaderQuestionnaire', param);
  }

  updateHeaderQuestionnaire(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/updateHeaderQuestionnaire', param);
  }

  /****** Smart Link ******/
  generateSmartLink(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/smartlink/generate', param);
  }

  getHeaderQuestionnaireList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/questionnaire/getheaderquestionairelist', param);
  }

  createQuestionnaireQuestion(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/createquestionnairequestion', param);
  }

  getQuestionnaireQuestionList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/getquestionairequestionlist', param);
  }

  updateQuestionnaireQuestion(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/updateQuestionnaireQuestion', param);
  }

  createQuestionnaireAnswer(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/createQuestionnaireAnswer', param);
  }

  createSmartLink(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/smartlink/generate', param);
  }

  uploadQuestionnaireImage(file: File, id: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('id', id);
    const req = new HttpRequest('POST', this.rootPath + '/api/questionnaire/uploadImg', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }


}
