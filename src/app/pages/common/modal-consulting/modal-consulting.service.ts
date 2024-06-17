import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalConsultingService {
  constructor( private api: ApiService) { }

  getConsultingData(param: ApiRequest<any>): Promise<ApiResponse<any>> { 
    return this.api.call('/api/consulting/getConsultingData', param);
  }

  updateConsulting(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/consulting/updateConsulting', param);
  }
}
