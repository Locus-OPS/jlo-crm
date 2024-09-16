import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getKBRating(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kbrating/getKBrating', param);
  }

  createKBRating(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kbrating/createKbrating', param);
  }

}
