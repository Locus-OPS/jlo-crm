import { BaseModel } from 'src/app/shared/base.model';

export interface ProgramData extends BaseModel {

  programId?: number;
  programNo?: string;
  programCode?: string;
  program?: string;
  activeFlag?: string;
  programStatus?: string;

  startDate?: string;
  endDate?: string;

  promotionCalculateRuleId?: string;
  promotionCalculateRule?: string;
  pointExpireBasisId?: string;
  pointExpireBasis?: string;
  description?: string;

}
