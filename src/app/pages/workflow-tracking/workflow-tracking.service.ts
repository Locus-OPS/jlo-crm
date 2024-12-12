import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkflowTrackingService {

  private rootPath = environment.endpoint;

  constructor(private http: HttpClient, private api: ApiService,) { }


  getWfTrackingByWorkflowId(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/workflow-tracking/getWftrackingByWorkflowId', param);
  }

  getWfTrackingById(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/workflow-tracking/getWftrackingById', param);
  }

  getWfTrackingGraph(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/workflow-tracking/getWftrackingGraph', param);
  }

}
