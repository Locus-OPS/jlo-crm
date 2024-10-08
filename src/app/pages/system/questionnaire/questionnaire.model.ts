import { BaseModel } from 'src/app/shared/base.model';

export interface QuestionnaireHeaderModel extends BaseModel {
  id?: string;
  questionnaireType?: string;
  formName?: string;
  sectionHeaderText?: string;
  statusCd?: string;
}

export interface QuestionnaireQuestionModel extends BaseModel {
  id?: string;
  headerId?: string;
  question?: string;
  answerType?: string;
  description?: string;
  imageUrl?: string;
  statusCd?: string;


}

export interface QuestionnaireAnswerModel extends BaseModel {
  id?: string;
  questionnaireType?: string;
  formName?: string;
  sectionHeaderText?: string;
  statusCd?: string;
  requiredFlg?: boolean;
  seqNo?: number;
}