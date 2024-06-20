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
        console.log("updateCaseDetail1")
       
       // console.log("result.data.caseNumber"+result.data.caseNumber)
       // console.log("updateCaseDetail2")
       if(result.data != undefined){
        sessionStorage.setItem('caseNumber',result.data.caseNumber);
        this.caseDetailSubject.next(result.data);
       }
      

      }
    });
  }

  clearCaseDetail() {
    sessionStorage.removeItem('caseNumber'); 
    this.caseDetailSubject.next(null);
  }
}
