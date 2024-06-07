import { BaseModel } from 'src/app/shared/base.model';

export interface PointTypeTabData extends BaseModel {

  pointTypeId?: number;
  programId?: number;

	pointType?: string;
  useFor?: string;

	costPerPoint?: number;
	activeFlag?: string;
	expiryBasisId?: string;
	expiryBasis?: string;
  period?: number;

	unitPeriodId?: string;
	unitPeriod?: string;
	expiryMonthId?: string;
	expiryMonth?: string;
	expiryDay?: number;
	primaryYn?: string;
}

