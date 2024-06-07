import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api: ApiService
  ) { }

  getProductList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/transaction/getProductList', param);
  }

}
