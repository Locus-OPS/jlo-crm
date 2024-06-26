import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private rootPath = environment.endpoint;

    constructor(
        private api: ApiService,
        private http: HttpClient
    ) {

    }

    getCountCaseEachStatus(param: ApiRequest<any>): Promise<ApiResponse<any>> {
        return this.api.call('/api/dashboard/getCountCaseEachStatus', param);
    }


    getCaseDashboardList(param?: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
        return this.api.call('/api/dashboard/getCaseDashboardList', param);
    }


    getChartBarDataList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
        return this.api.call('/api/dashboard/getChartBarDataList', param);
    }

    getChartPieDataList(param: ApiRequest<any>): Promise<ApiResponse<any>> {
        return this.api.call('/api/dashboard/getChartPieDataList', param);
    }



} 