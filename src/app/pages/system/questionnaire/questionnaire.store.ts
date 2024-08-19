import { Subject, Observable, BehaviorSubject } from 'rxjs';
;
import { Injectable } from '@angular/core';
import { QuestionnaireHeaderModel } from './questionnaire.model';
import { QuestionnaireService } from './questionnaire.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireStore {

  private questionnaireDetailSubject = new BehaviorSubject<QuestionnaireHeaderModel>(null);

  constructor(
    private qustionnaireService: QuestionnaireService
  ) { }

  getQuestionHeaderDetail(): Observable<QuestionnaireHeaderModel> {
    return this.questionnaireDetailSubject.asObservable();
  }

  updateQuestionHeaderDetail(headerId: string) {

    this.qustionnaireService.getQuestionnaireById({
      data: headerId
    }).then(result => {
      if (result.status) {
        if (result.data != undefined) {
          sessionStorage.setItem('headerId', result.data.headerId);
          this.questionnaireDetailSubject.next(result.data);
        }
      }
    });

  }

  clearQuestionnaireHeaderDetail() {
    sessionStorage.removeItem('headerId');
    this.questionnaireDetailSubject.next(null);
  }
}
