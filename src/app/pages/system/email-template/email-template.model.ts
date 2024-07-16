import { BaseModel } from 'src/app/shared/base.model';

export interface EmailTemplateModel extends BaseModel {
    id?: number;
    attId?: number;
    templateName: string;
    statusCd: string;
    module: string;
    description: string;

    filePath?: string;
    fileName?: string;
    fileExtension?: string;
    fileSize?: number;

}