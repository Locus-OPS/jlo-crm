import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private api: ApiService
  ) { }

  getMenuList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/menu/getMenuList', param);
  }

  createMenu(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/menu/createMenu', param);
  }

  updateMenu(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/menu/updateMenu', param);
  }

  deleteMenu(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/menu/deleteMenu', param);
  }

}
