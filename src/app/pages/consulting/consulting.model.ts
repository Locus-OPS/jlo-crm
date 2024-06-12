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
    agentState?: string;
    reasonCode?: string;
    consultingAction?:string;

    channelName?: string;
}