import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ServiceRequestModel } from './service-request.model';

import { ServiceRequestService } from './service-request-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestStore {

  private srDetailSubject = new BehaviorSubject<ServiceRequestModel>(null);

  constructor(
    private srService: ServiceRequestService
  ) { }

  getSrDetail(): Observable<ServiceRequestModel> {
    return this.srDetailSubject.asObservable();
  }

  updateSrDetail(srNumber: string) {
    this.srService.getSrBySrNumber({
      data: srNumber
    }).then(result => {
      if (result.status) {
        if (result.data != undefined) {
          sessionStorage.setItem('srNumber', result.data.srNumber);
          this.srDetailSubject.next(result.data);
        }
      }
    });
  }

  clearSrDetail() {
    sessionStorage.removeItem('srNumber');
    this.srDetailSubject.next(null);
  }
}
