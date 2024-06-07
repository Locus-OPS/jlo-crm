import { BaseModel } from 'src/app/shared/base.model';

export interface CardTierData extends BaseModel {

  programId?: number;
  tierCardTypeId?: number;
  tierId?: number;

  tier?: string;
  activeFlag?: string;
  cardType?: string;
  prefix?: string;
  primaryFlag?: string;
}

