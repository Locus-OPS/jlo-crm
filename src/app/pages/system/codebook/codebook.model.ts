import { BaseModel } from 'src/app/shared/base.model';

export interface CodebookData extends BaseModel {
  codeId?: string;
  codeType?: string;
  codeName?: string;
  parentType?: string;
  parentId?: string;
  lang?: string;
  seq?: number;
  etc1?: string;
  etc2?: string;
  etc3?: string;
  etc4?: string;
  etc5?: string;
  description?: string;
  activeFlag?: string;
  syncFlag?: string;
  buId?: number;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
}