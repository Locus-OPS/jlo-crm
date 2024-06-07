import { Subject, Observable } from 'rxjs';
import { KbDetail, KbDocument, KbDetailInfo } from './kb.model';
import { KbService } from './kb.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KbStore {

  private KbDetailSubjectObservable = new Subject<KbDetail>();
  private KbMainDocumentSubject = new Subject<KbDocument>();
  private KbDetailInfoSubject = new Subject<KbDetailInfo>();
  private KbContentTypeObservable = new Subject<string>();

  private kbContentType: string;

  constructor(
    private kbService: KbService
  ) { }

  observeKbContentType(): Observable<string> {
    return this.KbContentTypeObservable.asObservable();
  }

  observeMainDocumentSubject(): Observable<KbDocument> {
    return this.KbMainDocumentSubject.asObservable();
  }

  observeDetailInfo(): Observable<KbDetailInfo> {
    return this.KbDetailInfoSubject.asObservable();
  }

  observeKbDetail(): Observable<KbDetail> {
    return this.KbDetailSubjectObservable.asObservable();
  }

  updateKbDetail(contentId: number) {
    this.kbService.findKbDetailById({
      data: contentId
    }).then(result => {
      if (result.status) {
        this.KbDetailSubjectObservable.next(result.data);
      }
    });
  }

  updateKbMainDocument(doc: KbDocument) {
    this.KbMainDocumentSubject.next(doc);
  }

  loadKbContentType(contentType: string) {
    this.KbContentTypeObservable.next(contentType);
    this.kbContentType = contentType;
  }

  getKbContentType(): string {
    return this.kbContentType;
  }

}
