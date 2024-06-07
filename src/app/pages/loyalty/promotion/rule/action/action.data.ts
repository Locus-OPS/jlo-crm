export interface ActionData {

  actionId?: number;
	ruleId?: number;
	promotionId?: number;

	actionType?: string;
	actionDetail?: string;

	pointType?: number;
	pointOperator?: string;
	pointValue?: string;
	pointExpireUnit?: string;
	pointExpirePeriod?: number;

	updObj?: string;
	updAttr?: string;
	updOperator?: string;

	withObj?: string;
	withAttr?: string;
	withOperator?: string;
	withValue?: string;
	exp?: string;

	actionQuery?: string;
	useTxnPointTypeFlag?: string;

	pointExpireDate?: string;

	updGroup?: string;
	updName?: string;
	updObject?: string;
	updField?: string;
	updDataTypeId?: string;

	withGroup?: string;
	withName?: string;
	withObject?: string;
	withField?: string;
	withDataTypeId?: string;
	pointTypeId?: string;

	createdDate?: string;
	createdBy?: string;

	updatedDate?: string;
	updatedBy?: string;

}
