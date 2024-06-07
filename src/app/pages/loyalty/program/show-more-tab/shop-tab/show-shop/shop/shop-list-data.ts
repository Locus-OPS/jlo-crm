import { BaseModel } from 'src/app/shared/base.model';

export interface ShopListData extends BaseModel {

  shopId?: string;
  shopNo?: string;
  shopName?: string;
  shopType?: string;
  shopTypeId?: string;
  locationName?: string;
  locationId?: string;
  activeFlag?: string;
}
