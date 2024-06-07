import { Injectable } from '@angular/core';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiService } from 'src/app/services/api.service';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  getRewardList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/reward/getRewardList', param);
  }

  getRewardListWithoutPaging(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/getRewardListWithoutPaging', param);
  }

  saveReward(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/reward/saveReward', param);
  }

  uploadRewardImage(file: File, productId: number): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('productId', productId.toString());
    const req = new HttpRequest('POST', this.rootPath + '/api/reward/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  getRewardImagePath(pictureUrl: string){
    return this.rootPath + '/api/reward/reward_image/' + pictureUrl;
  }

}
