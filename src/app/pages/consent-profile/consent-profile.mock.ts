import { ConsentProfile } from './consent-profile.model';

export const consentProfileMock: ConsentProfile[] = [
    {
        profileId: 1,
        customerId: 100,
        cif: 123456,
        idNumber: 'A1234567890',
        idType: '1',
        idTypeName: 'National ID',
        accountNo: 'ACC1001',
        subAccountNo: 'SUB1',
        updatedDate: '2025-10-01T10:00:00Z',
        updatedBy: 'admin',
        operatedDate: '2025-10-01T11:00:00Z',
        operatedBy: 'admin',
        createdDate: '2025-09-01T09:00:00Z',
        createdBy: 'system',
        consentTypeCode: 'EMAIL',
        channelCode: 'WEB',
        whitelistFlag: 'N',
        profileIdName: 'Profile #1'
    },
    {
        profileId: 2,
        customerId: 101,
        cif: 654321,
        idNumber: 'B0987654321',
        idType: '2',
        idTypeName: 'Passport',
        accountNo: 'ACC1002',
        subAccountNo: 'SUB2',
        updatedDate: '2025-10-02T12:00:00Z',
        updatedBy: 'user1',
        operatedDate: '2025-10-02T13:00:00Z',
        operatedBy: 'user1',
        createdDate: '2025-08-15T08:30:00Z',
        createdBy: 'system',
        consentTypeCode: 'SMS',
        channelCode: 'MOBILE',
        whitelistFlag: 'Y',
        profileIdName: 'Profile #2'
    }
];
