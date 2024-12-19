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
export class WorkflowSystemService {
  private rootPath = environment.endpoint;
  constructor(private http: HttpClient, private api: ApiService) { }

  getWfSystemPageList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call("/api/workflow/getWorkflowSystemPageList", param);
  }

  getWfsystemDetail(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/workflow/getWorkflowSystemDetail", param);
  }

  createWfSystem(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/workflow/createWorkflowSystem", param);
  }

  updateWfSystem(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call("/api/workflow/updateWorkflowSystem", param);
  }
}
