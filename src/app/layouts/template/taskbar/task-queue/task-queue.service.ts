import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "src/app/model/api-response.model";
import { ApiService } from "src/app/services/api.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskQueueService {
  private rootPath = environment.endpoint;

  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }


  getTaskMessageQueList(): Promise<ApiResponse<any>> {
    return this.api.callGet('/api/interaction/gettaskmessagelist');
  }

}
