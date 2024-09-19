import { BaseModel } from 'src/app/shared/base.model';

export interface SchedulerHistoryLogData extends BaseModel {
    id?: number;
    schedulerId?: string;
    executedDate?: string;
    resultCode?: string;
    resultMessage?: string;
    errorMessage?: string;
  }