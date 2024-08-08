import { BaseModel } from 'src/app/shared/base.model';

export interface ServiceRequestModel extends BaseModel {

    srNumber?: string;
    type?: string;
    subtype?: string;
    priority?: string;
    status?: string;
    subject?: string;
    detail?: string;
    customerId?: BigInteger;
    owner?: string;
    displayName?: string;
    openedDate?: string;
    closedDate?: string;
    subName?: string;
    subTypeName?: string;
    priorityName?: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    memberType?: string;
    title?: string;
    phoneNo?: string;
    email?: string;
    channelName?: string;
    statusName?: string;
    openedDateDate?: string;
    closedDateDate?: string;
    createdDate?: string;
    updatedDate?: string;
    createdByName?: string;
    updatedByName?: string;
}
