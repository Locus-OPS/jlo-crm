import { BaseModel } from 'src/app/shared/base.model';

export interface EmailModel extends BaseModel {

    fromEmail?: string;
    toEmail?: string;
    ccEmail?: string;
    subjectEmail?: string;
    bodyEmail?: string;
    parentModule?: string;
    // file?: File;
}