import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Case } from './case.model';
import { CaseService } from './case.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaseStore {

  private caseDetailSubject = new BehaviorSubject<Case>(null);

  constructor(
    private caseService: CaseService
  ) { }

  getCaseDetail(): Observable<Case> {
    return this.caseDetailSubject.asObservable();
  }

  updateCaseDetail(caseNumber: string) {
    this.caseService.getCaseByCaseNumber({
      data: caseNumber
    }).then(result => {
      if (result.status) {
        this.caseDetailSubject.next(result.data);
      }
    });
  }

  clearCaseDetail() {
    this.caseDetailSubject.next(null);
  }
}
