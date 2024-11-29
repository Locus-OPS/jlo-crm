import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';


@Injectable({
  providedIn: 'root'
})
export class ProcessFlowService {
  private apiUrl = 'https://your-backend-api-endpoint.com/your-endpoint'; // URL ของ API

  constructor(
    private api: ApiService,
    private http: HttpClient

  ) { }
  // ฟังก์ชันเพื่อดึงข้อมูล workflow
  getWorkflowData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);

  }



  // getEmailLogList(param: ApiPageRequest<any>): Observable<any>{
  //   return this.api.call('/api/your-backend-api-endpoint.com/your-endpoint', param);
  // }

}
