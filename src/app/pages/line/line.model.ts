export interface LineMemberInfo {
  memberId: number;
  tierName: string;
  firstName: string;
  lastName: string;
  currentPoint: number;
  pointTypeName: string;
  type: string;
}

export interface LineRedemptionReward {
  productId: number;
  productCode: string;
  productName: string;
  productDetail: string;
  rewardUnitPerson: number;
  point: number;
  cash: number;
  redeemCount: number;
  inventoryBalance: number;
  productImgPath: string;

  usePoint?: number;
  useCash?: number;
  quantity?: number;

  isXcash: boolean;
}
