import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { ConsentProfileService } from './consent-profile.service';
import { ConsentProfile } from './consent-profile.model';

import { Dropdown } from 'src/app/model/dropdown.model';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
    selector: 'app-consent-profile',
    templateUrl: './consent-profile.component.html',
    styleUrls: ['./consent-profile.component.scss'],
    imports: [SharedModule]
})
export class ConsentProfileComponent extends BaseComponent implements OnInit {
    @ViewChild('searchFormDirective')
    searchFormDirective: FormGroupDirective;

    tableControl: TableControl = new TableControl(() => { this.search(); });

    searchForm: UntypedFormGroup;

    idTypeList: Dropdown[] = [];
    consentTypeList: Dropdown[] = [];
    channelList: Dropdown[] = [];

    submitted = false;

    selectedRow: ConsentProfile;
    dataSource: ConsentProfile[] = [];
    displayedColumns: string[] = ['action', 'cif', 'idNumber', 'idTypeName', 'consentTypeCode', 'channelCode', 'createdDate'];

    constructor(
        public consentProfileService: ConsentProfileService,
        private formBuilder: UntypedFormBuilder,
        public router: Router,
        public globals: Globals
    ) {
        super(router, globals);
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            cif: [''],
            idNumber: [''],
            idType: [''],
            consentTypeCode: [''],
            channelCode: ['']
        });

        // Load dropdown mock data and convert to Dropdown[] shape expected by project
        this.consentProfileService.getDropdowns().then(result => {
            if (result) {
                const mapToDropdown = (type: string, item: any): Dropdown => {
                    return {
                        codeId: item.code,
                        codeType: type,
                        codeName: item.name,
                        parentType: '',
                        parentId: '',
                        description: '',
                        lang: 'EN',
                        seq: 0,
                        etc1: '',
                        etc2: '',
                        etc3: '',
                        etc4: '',
                        etc5: '',
                        buId: 0,
                        activeFlag: 'Y'
                    };
                };
                if (result['ID_TYPE']) {
                    this.idTypeList = result['ID_TYPE'].map((d: any) => mapToDropdown('ID_TYPE', d));
                }
                if (result['CONSENT_TYPE_CODE']) {
                    this.consentTypeList = result['CONSENT_TYPE_CODE'].map((d: any) => mapToDropdown('CONSENT_TYPE_CODE', d));
                }
                if (result['CHANNEL_CD']) {
                    this.channelList = result['CHANNEL_CD'].map((d: any) => mapToDropdown('CHANNEL_CD', d));
                }
            }
        }).catch(() => {
            // ignore for mocks
        });

        this.search();
    }

    search() {
        const param = {
            ...this.searchForm.value,
            sortColumn: this.tableControl.sortColumn,
            sortDirection: this.tableControl.sortDirection
        };

        this.consentProfileService.search({
            pageSize: this.tableControl.pageSize,
            pageNo: this.tableControl.pageNo,
            data: param
        }).then(result => {
            this.dataSource = result.data || [];
            this.tableControl.total = result.total || (this.dataSource ? this.dataSource.length : 0);
        }, error => {
            Utils.alertError({
                text: 'Please try again later.',
            });
        });
    }

    onSearch() {
        this.submitted = true;
        if (!this.searchForm) {
            return;
        }
        const cif = this.searchForm.value['cif'];
        const idNumber = this.searchForm.value['idNumber'];
        // client validation: require at least one of cif or idNumber
        if (!cif && !idNumber) {
            Utils.alertError({ text: 'Please provide CIF or ID Number' });
            return;
        }
        this.tableControl.resetPage();
        this.search();
    }

    clear() {
        this.submitted = false;
        if (this.searchForm) {
            this.searchForm.reset();
        }
        this.dataSource = [];
    }

    onSelectRow(row: ConsentProfile) {
        this.selectedRow = row;
    }

    openProfileDetail(element: ConsentProfile) {
        console.log('openProfileDetail element: ', element);
        this.router.navigate([
            "/consent-profile/detail", { profileId: element.profileId }
        ]);
    }

}
