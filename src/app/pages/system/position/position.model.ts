import { BaseModel } from 'src/app/shared/base.model';

export interface Position extends BaseModel {
  posId?: number;
  posName?: string;
  parentPosId?: number;
  parentPosName?: string;
}
