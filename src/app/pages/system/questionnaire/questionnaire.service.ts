import { Injectable } from '@angular/core';
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
    return this.api.call('/api/questionnaire/getQuestionnaireById', param);
  }

  createHeaderQuestionnaire(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/createHeaderQuestionnaire', param);
  }

  updateHeaderQuestionnaire(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/questionnaire/updateHeaderQuestionnaire', param);
  }

}
