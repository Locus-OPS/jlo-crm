import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor( private api: ApiService) { }

  getCampaignList(param): Promise<any> {
    return this.api.call('/api/campaign/getCampaignList', param);
  }

  saveCampaign(param): Promise<any> {
    return this.api.call('/api/campaign/saveCampaign', param);
  }
}
