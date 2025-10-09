export interface ConsentProfileDetail {
    profileId: number;
    customerId?: number;
    cif?: number | string;
    idNumber?: string;
    idType?: string;
    idTypeName?: string;
    accountNo?: string;
    subAccountNo?: string;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
    whitelistFlag?: string;
}

export interface ConsentAction {
    actionId: number;
    actionDate?: string;
    consentType?: string;
    channel?: string;
    operatedBy?: string;
    note?: string;
}
