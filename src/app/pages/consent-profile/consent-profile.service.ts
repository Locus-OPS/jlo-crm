import { Injectable } from '@angular/core';
import { ConsentProfile } from './consent-profile.model';
import { consentProfileMock } from './consent-profile.mock';

@Injectable({
    providedIn: 'root'
})
export class ConsentProfileService {

    constructor() { }

    /**
     * Search mock consent profiles with simple filtering + paging.
     * request shape:
     * {
     *   pageSize: number,
     *   pageNo: number,
     *   data: { cif?, idNumber?, consentTypeCode?, channelCode?, idType? }
     * }
     */
    search(request: any): Promise<{ data: ConsentProfile[], total: number }> {
        return new Promise(resolve => {
            const all = consentProfileMock.slice();

            const q = (request && request.data) ? request.data : {};
            const filtered = all.filter(item => {
                if (q['cif']) {
                    if (!item.cif || item.cif.toString() !== q['cif'].toString()) {
                        return false;
                    }
                }
                if (q['idNumber']) {
                    if (!item.idNumber || !item.idNumber.includes(q['idNumber'])) {
                        return false;
                    }
                }
                if (q['consentTypeCode']) {
                    if (!item.consentTypeCode || item.consentTypeCode !== q['consentTypeCode']) {
                        return false;
                    }
                }
                if (q['channelCode']) {
                    if (!item.channelCode || item.channelCode !== q['channelCode']) {
                        return false;
                    }
                }
                if (q['idType']) {
                    if (!item.idType || item.idType !== q['idType']) {
                        return false;
                    }
                }
                return true;
            });

            const pageSize = request && request.pageSize ? Number(request.pageSize) : filtered.length;
            const pageNo = request && request.pageNo ? Number(request.pageNo) : 1;
            const start = (pageNo - 1) * pageSize;
            const data = filtered.slice(start, start + pageSize);

            // simulate async
            setTimeout(() => resolve({ data: data, total: filtered.length }), 50);
        });
    }

    /**
     * Return dropdown mock data for the component (code -> [{code,name}])
     */
    getDropdowns(): Promise<{ [key: string]: { code: string, name: string }[] }> {
        return Promise.resolve({
            'CONSENT_TYPE_CODE': [
                { code: 'EMAIL', name: 'Email' },
                { code: 'SMS', name: 'SMS' },
                { code: 'PUSH', name: 'Push Notification' }
            ],
            'CHANNEL_CD': [
                { code: 'WEB', name: 'Web' },
                { code: 'MOBILE', name: 'Mobile' },
                { code: 'BRANCH', name: 'Branch' }
            ],
            'ID_TYPE': [
                { code: '1', name: 'National ID' },
                { code: '2', name: 'Passport' },
                { code: '3', name: 'Tax ID' }
            ]
        });
    }

}
