import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(
    private api: ApiService
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


}
