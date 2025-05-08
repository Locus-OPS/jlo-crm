import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClaimProcessService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getDataExtractionList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/claim-process/getDataExtractionList', param);
  }

  geminiAnalyze(file: File, prompt: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('prompt', prompt);
    const req = new HttpRequest('POST', this.rootPath + '/api/claim-process/analyze', formdata, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

}
