import { BaseModel } from 'src/app/shared/base.model';

export interface RedeemMethodData extends BaseModel {
	productRedeemMethodId?: number;
	productId?: number;

	redeemMethodType?: string;
	redeemMethodTypeName?: string;

	point?: number;
	cash?: number;
}

