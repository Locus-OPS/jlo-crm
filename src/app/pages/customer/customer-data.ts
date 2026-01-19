import { ChangeLog } from "src/app/model/change-log.model";
import { CustomerAddressData } from './customer-address-data';

export interface CustomerData {
    customerId?: number;
    customerType?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    citizenId?: string;
    passportNo?: string;
    nationality?: string;
    birthDate?: string;
    gender?: string;
    maritalStatus?: string;
    occupation?: string;
    phoneArea?: string;
    phoneNo?: string;
    email?: string;
    businessName?: string;
    taxId?: string;
    businessType?: string;
    registrationStore?: string;
    registrationChannel?: string;
    customerStatus?: string;

    address?: Array<CustomerAddressData>;
    changeLog?: Array<ChangeLog>;

    approvedDate?: string;
    approvedBy?: string;
    createdBy?: string;
    createdDate?: string;
    updatedBy?: string;
    updatedDate?: string;

    memberId?: number;
    memberCardNo?: string;
}