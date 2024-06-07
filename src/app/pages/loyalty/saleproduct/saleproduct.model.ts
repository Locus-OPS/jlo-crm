import { BaseModel } from 'src/app/shared/base.model';

export interface Saleproduct extends BaseModel {

  itemCode?: string;
  itemName?: string;
  itemStatus?: string;
  statusName?: string;
  pricing?: BigInteger;

  categoryCode?: number;  
  categoryName?: string;
  unit?: string;
  remark?: string;
}