import { BaseModel } from 'src/app/shared/base.model';

export interface DepartmentTeamModel extends BaseModel {
  id?: number;
  departmentId?: number;
  teamName?: string;
  description?: string;
  statusCd?: string;
}
