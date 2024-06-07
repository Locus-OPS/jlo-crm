import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NewCase {
  caseNumber: string;
  customerId: string;
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

}
