import { BaseModel } from 'src/app/shared/base.model';

export interface KbNode {
  id: string;
  parentId: string;
  title: string;
  folder: boolean;
  children?: KbNode[];
  icon: string;
}

export interface FlatNode {
  id: string;
  parentId: string;
  expandable: boolean;
  name: string;
  level: number;
  icon: string;
}

export interface KbDetail extends BaseModel {
  contentId?: number;
  catId?: number;
  catName?: string;
  type?: string;
  subType?: string;
  title?: string;
  contentStatus?: string;
  display?: string;
  seq?: number;
  sendDocFlag?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}

export interface KbDocument extends BaseModel {
  contentAttId?: number;
  attId?: number;
  contentId: number;
  title: string;
  descp: string;
  mainFlag: string;
  filePath?: string;
  fileName?: string;
  fileExtension?: string;
  fileSize?: number;
}

export interface KbDetailInfo {
  url?: string;
  description?: string;
}