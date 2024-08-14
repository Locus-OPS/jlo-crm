import { BaseModel } from 'src/app/shared/base.model';

export interface QuestionnaireModel extends BaseModel {
  id?: number;
  buName?: string;
  activeYn?: string;
}

export interface SearchQuestionnaire {
  buName?: string;
  activeYn?: string;
}