export interface ConsultingModel {
    id?: string;
    consultingNumber?: string;
    channelCd?: string;
    statusCd?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
    callingNumber?: string;
    callObjectId?: string;
    ownerId?: string;
    note?: string;
    consultingTypeCd?: string;
    contactId?: string;
     
    consultingAction?:string;

    customerName?:string;
    statusName?: string;
    channelName?: string;
    contactName?:string;
}