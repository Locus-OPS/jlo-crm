export interface Profile {
  userId: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  roleCode: string;
  menuRespList: MenuResp[];
}

export interface MenuResp {
  id: number;
  name?: string;
  type?: string;
  icon?: string;
  link?: string;
  parentMenuId?: number;
  respFlag: string;
  use: string;
}
