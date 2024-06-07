import { BaseModel } from 'src/app/shared/base.model';



export interface PartnerData extends BaseModel {

	partnerId?: number;
	partnerNo?: string;
	partner?: string;
	partnerType?: string;
	partnerTypeId?: number;
	activeFlag?: string;
  }
