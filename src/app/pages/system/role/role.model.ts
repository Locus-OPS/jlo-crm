import { BaseModel } from 'src/app/shared/base.model';

export interface RoleModel extends BaseModel {
  id?: number;
  roleCode?: string;
  roleName?: string;
  useYn?: string;
}
