import { BaseModel } from 'src/app/shared/base.model';

export interface ShopTabData extends BaseModel {

  programShopExcludedId?: number;
  programShopIncludedId?: number;

  programId?: number;

  locationId?: string;
  location?: string;
  shopId?: string;
  shop?: string;
  shopNo?: string;
  shopTypeId?: string;
  shopType?: string;

  lstShopId?: string;
  isActive?: string;
  isExistShop?: string;
  locationCdAll?: string;
  shopTypeIdAll?: string;

}
