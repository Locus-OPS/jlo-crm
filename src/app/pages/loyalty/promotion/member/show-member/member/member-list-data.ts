export interface MemberListData {

  customerId?: string;
  memberId?: string;
  accountNo?: string;
  citizenCardNo?: string;
  passportNo?: string;
  cardNo?: string;
  cardTypeName?: string;
  activeFlag?: string;
  cardPrefix?: string;
  titleName?: string;
  programId?: string;
  programName?: string;
  tierName?: string;
  memberTierId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nickName?: string;
  genderName?: string;
  nationalityId?: string;
  birthdate?: string;
  occupationId?: string;
  maritalStatusId?: string;
  image?: string;
  approvedDate?: string;
  approvedBy?: string;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
  registration?: string;
  suffix?: string;
  email?: string;
  countryCode?: string;
  na1?: string;
  na2?: string;
  phoneNumber?: string;

}

export interface MemberMasterData {
  memberId: number;
  memberCardNo: string;
  firstName: string;
  lastName: string;
  tierName: string;
}
