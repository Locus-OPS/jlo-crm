import { BaseModel } from 'src/app/shared/base.model';

export interface Caseatt extends BaseModel {
    caseAttId?: number;
    attachmentId?: number;
    caseNumber?: string;
    subject?: string;
    detail?: string;
    filePath?: string;
    fileName?: string;
    fileExtension?: string;
    fileSize?: number;
    fullPath?: string;

}
 
  