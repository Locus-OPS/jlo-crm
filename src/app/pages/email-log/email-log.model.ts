import { BaseModel } from 'src/app/shared/base.model';

export interface EmailModel extends BaseModel {
    id?: string;
    parentId?: string;
    parentModule?: string;
    toEmail?: string;
    ccEmail?: string;
    subjectEmail?: string;
    bodyEmail?: string;
    attachmentId: string;
}
