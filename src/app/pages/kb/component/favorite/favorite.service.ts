import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getKBFavorite(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kbfavorite/getkbfavorite', param);
  }

  createKBFavorite(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/kbfavorite/createkbfavorite', param);
  }

}
