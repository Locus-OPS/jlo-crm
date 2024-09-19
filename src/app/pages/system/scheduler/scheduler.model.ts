import { BaseModel } from 'src/app/shared/base.model';

export interface SchedulerData extends BaseModel {
  id?: number;
  schedulerName?: string;
  schedulerType?: string;
  expression?: string;
  useYn?: string;
  classpath?: string;
  runonInstance?: String;
  runonContextRoot?: String;
  priority?: number;
  seq?:number;
  status?:String;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
}