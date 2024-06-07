import { BaseModel } from 'src/app/shared/base.model';

export interface Caseactivity extends BaseModel {
    
    activityNumber?: string;
    caseNumber?: string;
    type?: string;
    typeName?: string;
    status?: string;
    statusName?: string;
    subject?: string;
    detail?: string;
    ownerCode?: string;
    deptCode?: string; 
    ownerName?: string;
    deptName?: string; 
}