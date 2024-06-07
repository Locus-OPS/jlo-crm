import { BaseModel } from 'src/app/shared/base.model';

export interface TransactionData extends BaseModel {

  txnId?: number;
	programId?: number;
	memberTierId?: number;
	memberId?: number;
  cancelledTxnId?: number;
	refTxnId?: number;

	productId?: number ;
	cardTierId?: number ;
	quantity?: number ;
  pointBefore?: number ;
	earnPoint?: number ;
	burnPoint?: number ;
	balancePoint?: number ;
	requestPoint?: number ;
	progTierSpending?: number ;
	progTierPoint?: number ;
	cardTypeId?: number ;
	pointAdjustId?: number ;
  redemptionId?: number ;
	redeemPoint?: number ;
	refMemberId?: number ;

	amount?: number ;
	spending?: number ;
  progTierLimitPerTime?: number ;
	progTierLimitPerMonth?: number ;
	progTierLimitPerDay?: number ;

  program?: string;
	memberName?: string;
	memberTier?: string ;
	cardNumber?: string ;
	cardTier?: string;
	productTypeId?: string ;
	productType?: string ;
	product?: string ;
	loyProductTypeId?: string ;
	loyProductType?: string ;
	rewardTypeId?: string ;
	rewardType?: string ;
	channel?: string ;
	receiptId?: string ;

  	storeShopId?: string ;
	storeShopType?: string ;
	storeShopTypeName?: string;
	txnTypeId?: string ;
	txnType?: string;
	txnSubTypeId?: string ;
	txnSubType?: string;
	txnStatusId?: string ;
	txnStatus?: string;
	subStatusId?: string ;
	subStatus?: string;
	redeemMethodId?: string ;
	redeemMethod?: string;

	processedDtl?: string ;
	referedCardNo?: string ;
	posTransId?: string ;
	posCancelTransId?: string ;
	pointTypeId?: string ;
	pointType?: string;

	progOverrideBasePointYn?: string ;
	productCode?: string ;
	requestCash?: string;

	location?: string ;
	cardPrefix?: string ;
	posCancelTypeId?: string;
	posCancelType?: string;

	receiptDate?: string  ;
	defaultPointExpireDate?: string;
	posTransDate?: string ;
	processedDate?: string;
	processedTime?: string;
}
