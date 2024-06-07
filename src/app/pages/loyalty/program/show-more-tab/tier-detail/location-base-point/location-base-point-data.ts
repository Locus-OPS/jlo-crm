import { BaseModel } from 'src/app/shared/base.model';

export interface LocationBasePointData extends BaseModel {

  tierId?: number;
  locationBasePointId?: number;

  activeFlag?: string;
  shopId?: number;
  shop?: string;
  shopType?: string;

  spending?: number;
  point?: number;

  programId?: number;
  locationId?: number;
  location?: string;

  shopTypeId?: number;
}

