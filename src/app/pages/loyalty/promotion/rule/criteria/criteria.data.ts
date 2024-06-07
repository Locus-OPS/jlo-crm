export interface CriteriaData {

  criteriaId?: number;
	ruleId?: number;
	promotionId?: number;

	description?: string;
	exp?: string;
	srcObj?: string;
	srcAttr?: string;
	srcCondition?: string;
	compareToOv?: string;
	dscObj?: string;
	dscAttr?: string;
	dscOperator?: string;
	dscValue?: string;
	dscValueExp?: string;
	lov?: string;

	dscObjValue?: string;
	srcObjectName?: string;
	srcFieldName?: string;
	srcDataType?: string;
	dscObjectName?: string;
	dscFieldName?: string;
	dscDataType?: string;

	createdDate?: string;
	createdBy?: string;

	updatedDate?: string;
  updatedBy?: string;

}
