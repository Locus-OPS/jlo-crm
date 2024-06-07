import { BaseModel } from 'src/app/shared/base.model';

export interface CampaignData extends BaseModel {
    campaignId?: string;
    campaignCode?: string;
    campaign?: string;
    campaignTypeId?: string;
    activeFlag?: string;
    detail?: string;
  
    startDate?: string;
    endDate?: string;
  }
