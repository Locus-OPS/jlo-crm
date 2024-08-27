import { BaseModel } from 'src/app/shared/base.model';

export interface DepartmentModel extends BaseModel {
  id?: number;
  departmentName?: string;
  description?: string;
  statusCd?: string;
}
