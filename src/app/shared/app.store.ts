import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NewCase {
  caseNumber: string;
  customerId: string;
}

export interface NewSr {
  srNumber: string;
  customerId: string;
}


export interface NewQuestionnaire {
  headerId: string;
}


@Injectable({
  providedIn: 'root'
})
export class AppStore {

  private newCaseSubject = new Subject<NewCase>();
  observeNewCase(): Observable<NewCase> {
    return this.newCaseSubject.asObservable();
  }

  broadcastNewCase(newCase: NewCase) {
    this.newCaseSubject.next(newCase);
  }



  private newSrSubject = new Subject<NewSr>();
  observeNewSr(): Observable<NewSr> {
    return this.newSrSubject.asObservable();
  }

  broadcastNewSr(newSr: NewSr) {
    this.newSrSubject.next(newSr);
  }


  private newQuestionSubject = new Subject<NewQuestionnaire>();
  observeNewQuestionnaire(): Observable<NewQuestionnaire> {
    return this.newQuestionSubject.asObservable();
  }

  broadcastNewQuestionnaire(newQuestionnaire: NewQuestionnaire) {
    this.newQuestionSubject.next(newQuestionnaire);
  }

}
