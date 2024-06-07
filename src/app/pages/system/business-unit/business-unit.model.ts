import { BaseModel } from 'src/app/shared/base.model';

export interface BusinessUnit extends BaseModel {
  id?: number;
  buName?: string;
  activeYn?: string;
}

export interface SearchBusinessUnit {
  buName?: string;
  activeYn?: string;
}