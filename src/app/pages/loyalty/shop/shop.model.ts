import { BaseModel } from 'src/app/shared/base.model';

export interface ShopData extends BaseModel {

  shopId?: string;
  shopNo?: string;
  shopName?: string;
  shopType?: string;
  shopTypeId?: string;
  location?: string;
  locationId?: string;
  activeFlag?: string;
}
