import { Injectable } from '@angular/core';
import { ConsentProfileDetail, ConsentAction } from './consent-profile-detail.model';

@Injectable({
    providedIn: 'root'
})
export class ConsentProfileDetailService {

    constructor() { }

    /**
     * Return dropdown mock data for detail component
     */
    getDropdowns(): Promise<{ [key: string]: { code: string, name: string }[] }> {
        return Promise.resolve({
            'ENTITY_CODE': [
                { code: 'ENT1', name: 'Entity One' },
                { code: 'ENT2', name: 'Entity Two' },
                { code: 'ENT3', name: 'Entity Three' }
            ]
        });
    }

    /**
     * Return mock profile detail
     */
    getDetail(profileId: string): Promise<ConsentProfileDetail> {
        const id = Number(profileId) || 0;
        return Promise.resolve({
            profileId: id,
            customerId: 1000 + id,
            cif: (5000 + id).toString(),
            idNumber: `ID-${id}`,
            idType: '1',
            idTypeName: 'National ID',
            accountNo: 'ACC-' + id,
            subAccountNo: 'SUB-' + id,
            createdDate: new Date().toISOString(),
            createdBy: 'system',
            updatedDate: new Date().toISOString(),
            updatedBy: 'system',
            whitelistFlag: 'N'
        });
    }

    /**
     * Return mock actions for profile
     */
    getActions(profileId: string): Promise<ConsentAction[]> {
        const id = Number(profileId) || 0;
        const now = new Date();
        const actions: ConsentAction[] = [
            { actionId: id * 10 + 1, actionDate: now.toISOString(), consentType: 'EMAIL', channel: 'WEB', operatedBy: 'user1', note: 'Initial consent' },
            { actionId: id * 10 + 2, actionDate: new Date(now.getTime() - 86400000).toISOString(), consentType: 'SMS', channel: 'MOBILE', operatedBy: 'user2', note: 'Update' },
            { actionId: id * 10 + 3, actionDate: new Date(now.getTime() - 2 * 86400000).toISOString(), consentType: 'PUSH', channel: 'APP', operatedBy: 'user3', note: 'Withdrawal' }
        ];
        return Promise.resolve(actions);
    }
}
