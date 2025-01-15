export interface Profile {
  id: number
  userId: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  roleCode: string;
  divId: string;
  divName: string;
  teamId: string;
  teamName: string;
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
