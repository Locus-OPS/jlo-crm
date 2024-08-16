import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayServiceService {

  constructor(private api: ApiService) { }

  getHolidayList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/holiday/getholidaylist', param);
  }
  saveHoliday(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/holiday/saveholiday', param);
  }

  editHoliday(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/holiday/editholiday', param);
  }

  deleteHoliday(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/holiday/deleteholiday', param);
  }
}
