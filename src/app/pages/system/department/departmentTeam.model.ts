import { BaseModel } from 'src/app/shared/base.model';

export interface DepartmentTeamModel extends BaseModel {
  id?: number;
  departmentId?: string;
  teamName?: string;
  description?: string;
  statusCd?: string;
}
