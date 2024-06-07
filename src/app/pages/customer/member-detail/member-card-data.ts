export interface MemberCardData{
    memberId?:number;
    memberCardNo?:string;
    primary?:boolean;
    primaryYn?:string;
    cardType?:string;
    cardTierId?:string;
    cardExpiryDate?:string;
    cardStatus?:string;
    cardIssueDate?:string;
    cardActiveDate?:string;
    cardInactiveDate?:string;
    cardLastBlockDate?:string;
    reIssueReason?:string;
    reIssueCardNo?:string;
    createdBy?: string;
    createdDate?: string;
    updatedBy?: string;
    updatedDate?: string;

    programId?:string;
    programName?:string;

    cardBlockReason?:string;
}