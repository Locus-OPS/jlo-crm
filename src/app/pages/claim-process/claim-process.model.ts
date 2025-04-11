import { BaseModel } from 'src/app/shared/base.model';

export interface UserData extends BaseModel {
  id?: string;
  userId?: string;
  loginType?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  displayName?: string;
  useYn?: string;
  email?: string;
  lang?: string;
  password?: string;
  pictureUrl?: string;
  roleCode?: string;
  roleName?: string;
  buName?: string;
  posId?: string;
  posName?: string;
  divId?: string;
  divName?: string;
}
