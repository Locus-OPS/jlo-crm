import { Injectable } from '@angular/core';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class KbDetailSearchbykeywordService {

  constructor(private api: ApiService) { }

  getKbByKeywordList(param: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call("/api/kb/getKbbyKeywordList", param);
  }
}
