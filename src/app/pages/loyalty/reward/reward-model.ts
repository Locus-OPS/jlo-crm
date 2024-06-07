import { ProductData } from '../product/product-data';

export interface RewardData extends ProductData {

	rewardTypeId?: string;
	rewardType?: string;
	rewardPrice?: string;
	rewardTax?: string;
	rewardCategoryId?: string;
	rewardCategory?: string;
	rewardSubCategoryId?: string;
	rewardSubCategory?: string;
	rewardUnitPerson?: string;
	rewardActiveFlag?: string;
	rewardChannelWebPortalFlag?: string;
	rewardChannelLineFlag?: string;
	rewardChannelMobileFlag?: string;
	rewardChannelKiosFlag?: string;
}
