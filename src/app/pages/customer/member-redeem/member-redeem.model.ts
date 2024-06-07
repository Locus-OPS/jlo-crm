export interface RedemptionMemberInfo {
  memberId: number;
  programId: number;
  programName: string;
  tierName: string;
  firstName: string;
  lastName: string;
  currentPoint: number;
}

export interface RedemptionRewardCriteria {
  memberId: number;
  displayType?: string;
  rewardName?: string;
  redeemMethod?: string;
  minPoint?: number;
  maxPoint?: number;
}

export interface RedemptionReward {
  productId: number;
  productCode: string;
  productName: string;
  productDetail: string;
  rewardUnitPerson: number;
  point: number;
  cash: number;
  redeemCount: number;
  inventoryBalance: number;

  usePoint?: number;
  useCash?: number;
  quantity?: number;
  displayInventoryBalance?: number;
  displayRedeemCount?: number;
}
