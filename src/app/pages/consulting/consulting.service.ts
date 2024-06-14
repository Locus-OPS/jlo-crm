import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultingService {

  constructor(
    private api: ApiService
  ) { 

  }

  processWalkinConsulting(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/consulting/processWalkinConsulting', param);
  }

  getConsultingDataList(param?: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/consulting/getConsultingDataList', param);
  }
  


}