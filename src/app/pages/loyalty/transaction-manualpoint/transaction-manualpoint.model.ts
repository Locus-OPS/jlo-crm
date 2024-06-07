import { BaseModel } from 'src/app/shared/base.model';

export interface ManualAdjustModel extends BaseModel {
    txnId?: number,
    balancePoint?: string,
    cardNumber?: string,
    cardTier?: string,
    channel?: string,
    createEndDate?: string,
    createStartDate?: string,
    loyProductType?: string,
    memberFirstName?: string,
    memberId?: number,
    memberLastName?: string,
    memberMobile?: string,
    memberName?: string,
    memberTierId?: string,
    pointAdjust?: string,
    pointBefore?: string,
    pointType?: string,
    productId?: string,
    productName?: string,
    productType?: string,
    programId?: string,
    requestPoint?: string,
    status?: string,
    txnSubType?: string,
    txnType?: string
}