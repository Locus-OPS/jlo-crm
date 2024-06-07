export interface RouteInfo {
  link: string;
  name: string;
  type: string;
  icon: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  link: string;
  name: string;
  ab: string;
  type?: string;
  icon: string;
}
