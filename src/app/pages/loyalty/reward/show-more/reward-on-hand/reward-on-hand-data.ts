import { BaseModel } from 'src/app/shared/base.model';

export interface RewardOnHandData extends BaseModel {
  productOnhandId?: number;
  productId?: number;

  onhandType?: string;
	amount?: number;
	remark?: string;
}

