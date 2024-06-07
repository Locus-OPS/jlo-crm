
export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}

export interface LineContext {
  type: string;
  utouId: string;
  userId: string;
  viewType: string;
  accessTokenHash: string;
}
