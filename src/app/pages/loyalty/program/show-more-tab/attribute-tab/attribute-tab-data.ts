import { BaseModel } from 'src/app/shared/base.model';

export interface AttributeTabData extends BaseModel {
	attrId?: number;
	attrName?: string;
	attrGroupId?: number;
	attrGroupName?: string;
	programId?: number;
	attrActiveYn?: string;
	object?: string;
	fieldName?: string;
	readOnlyYn?: string;
	dataType?: string;
	dataTypeName?: string;
	attrPickList?: string;
	method?: string;
	methodName?: string;
	remark?: string;
	defaultValue?: string;
	promotionAttrIdNotEqual?: string;
}

