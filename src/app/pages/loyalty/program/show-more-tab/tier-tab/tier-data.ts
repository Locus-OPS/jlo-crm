import { BaseModel } from 'src/app/shared/base.model';

export interface TierData extends BaseModel {

  programId?: number;
  activeFlag?: string;

  tierId?: number;
  tierCode?: string;
  tier?: string;
  tierImgPath?: string;

  spending?: number;
  point?: number;

  remark?: string;
  baseFlag?: string;

  limitSpendingPerTime?: number;
  limitSpendingPerDay?: number;
  limitSpendingPerMonth?: number;

  tierLevel?: string;
}

