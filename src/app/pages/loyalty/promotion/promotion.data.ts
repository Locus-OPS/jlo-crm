export interface PromotionData {

  promotionId?: number;
	promotion?: string;
	promotionTypeId?: string;
	promotionType?: string;

	startDate?: string;
	endDate?: string;

	promotionReceiveTimeLimit?: number;
	remark?: string;
	activeFlag?: string;
	baseFlag?: string;
	useBasePointFlag?: string;
	deleteFlag?: string;

	productInclusionId?: string;
	productInclusion?: string;
	productListId?: number;

	memberInclusionId?: string;
	memberInclusion?: string;
	memberListId?: number;

	shopInclusionId?: string;
	shopInclusion?: string;
	shopListId?: number;

	capTypeId?: string;
	capType?: string;

	minCap?: number;
	maxCap?: number;

	promotionAttrId?: number;
	programId?: number;
	program?: string;

	created?: string;
	createdBy?: string;

	updated?: string;
	updateddBy?: string;

	promotionDuplicate?: string;

}
