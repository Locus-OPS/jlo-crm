import { BaseModel } from 'src/app/shared/base.model';

export interface ProductData extends BaseModel {

	productId?: number;
	productCode?: string;
	product?: string;
	productDetail?: string;
	productFullDetail?: string;
	productBarCode?: string;
	productQrCode?: string;
	productStatus?: string;

	productTypeId?: string;
	productType?: string;
	productImgPath?: string;
	productCategoryId?: string;
	productCategory?: string;
	productSubCategoryId?: string;
	productSubCategory?: string;

	productActiveFlag?: string;
	productPrice?: string;
	productPointUse?: string;
	productBrand?: string;

  programId?: string;
	program?: string;

	campaignId?: string;
	campaign?: string;

	loyProductTypeId?: string;
	loyProductType?: string;

	cc?: string;
	gl?: string;
	io?: string;

  isGiftCardFlag?: string;
	prizeMasterIsGiftcard?: string;

	inventoryRedeemCount?: string;
	inventoryBalance?: string;
	quantity?: string;

	fileOriginalName?: string;
	filePhysicalName?: string;
	bytesAvatar?: string;

	startDate?: string;
	endDate?: string;
}
