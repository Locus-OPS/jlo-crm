import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
    providedIn: 'root'
  })
  export class SchedulerService {
  
    constructor(
      private api: ApiService
    ) { }
  
    searchScheduler(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
      return this.api.call('/api/scheduler/getSchedulerJobs', param);
    }
  
    saveScheduler(param: ApiRequest<any>): Promise<ApiResponse<any>> {
      console.log("saveScheduler");
      return this.api.call('/api/scheduler/saveSchedulerJob', param);
    }
  
  }
  