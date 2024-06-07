export interface CustomerAddressData{
    addressId?:number;
    customerId?:number;
    primary?:boolean;
    primaryYn?:string;
    addressType?:string;
    address?:string;
    postCode?:string;
    subDistrict?:string;
    district?:string;
    province?:string;
    country?:string;
    createdBy?: string;
    createdDate?: string;
    updatedBy?: string;
    updatedDate?: string;

    fullAddress?:string;
}