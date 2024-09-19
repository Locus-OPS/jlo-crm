import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';

@Injectable(
    {
      providedIn: 'root' 
    }
)
export class SchedulerHistoryLogService {

  private schedulerDetail = new BehaviorSubject<number>(null);

    constructor(
        private api: ApiService,
      ) { }
    
      getSchedulerHistoryLogById(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
        return this.api.call('/api/scheduler/schedulerHistoryDetail', param);
      }

      getSchedulerById(param: ApiRequest<any>): Promise<ApiResponse<any>> {
        return this.api.call('/api/scheduler/getSchedulerById', param);
      }

      executeScheduler(param: ApiRequest<any>): Promise<ApiResponse<any>> {
        return this.api.call('/api/scheduler/executeNow', param);
      }

}
