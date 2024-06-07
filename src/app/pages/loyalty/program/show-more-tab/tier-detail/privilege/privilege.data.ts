import { BaseModel } from 'src/app/shared/base.model';

export interface PrivilegeData extends BaseModel {

	serviceId?: number;
	programId?: number;
	tierId?: number;

	serviceName?: string;

	serviceType?: string;
	serviceTypeName?: string;

	unit?: string;
	unitName?: string;
	unitValue?: number;

	location?: string;
	locationName?: string;
}

