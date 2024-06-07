import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ProgramData } from './program-data';

@Injectable({
  providedIn: 'root'
})
export class ProgramStore {

  private programSubject = new BehaviorSubject<ProgramData>(null);

  selectProgram(data: ProgramData) {
    this.programSubject.next(data);
  }

  getProgram(): Observable<ProgramData> {
    return this.programSubject.asObservable();
  }

}
