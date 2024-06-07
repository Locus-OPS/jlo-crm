import { BaseModel } from 'src/app/shared/base.model';

export interface SaleProductCategory extends BaseModel {

	categoryCode?: string;

	categoryName?: string;

	parentCategoryCode?: string;

	level?: string;

	categoryStatus?: string;

	categoryStatusName?: string;

	remark?: string;

}
