import { BaseModel } from 'src/app/shared/base.model';

export interface Menu extends BaseModel {

  id: number;

  name: string;

  type?: string;

  icon?: string;

  link?: string;

  lang?: string;

  activeFlag?: string;

  seq?: number;

  parentMenuId?: string;

  apiPath?: string;

  children?: Menu[];

}

export interface SearchMenu {

  name?: string;

  parentMenuId?: string;

}

export interface FlatMenuNode extends BaseModel {
  id: number;
  parentId: string;
  expandable: boolean;
  name: string;
  level: number;
}
