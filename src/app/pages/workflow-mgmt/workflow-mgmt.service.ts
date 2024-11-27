import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkflowMgmtService {
  private rootPath = environment.endpoint;
  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  //ดึงข้อมูล Workflow
  getWorkflowPageList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/workflow/getWorkflowPageList', param);
  }

  //สร้าง Workflow
  createWorkflow(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/workflow/createWorkflow', param);
  }
}
