import { BaseModel } from 'src/app/shared/base.model';

export interface Internationalization extends BaseModel {

  msgCode?: string;

  msgValue?: string;

  langCd?: string;

}

export interface SearchInternationalization {

  msgCode?: string;

  msgValue?: string;

}