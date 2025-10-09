import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ConsentProfileDetailService } from './consent-profile-detail.service';
import { ConsentProfileDetail, ConsentAction } from './consent-profile-detail.model';

@Component({
    selector: 'app-consent-profile-detail',
    templateUrl: './consent-profile-detail.component.html',
    styleUrls: ['./consent-profile-detail.component.scss'],
    imports: [SharedModule]
})
export class ConsentProfileDetailComponent extends BaseComponent implements OnInit {

    profileId: string = '';
    createForm: UntypedFormGroup;
    detail: ConsentProfileDetail | null = null;
    actions: ConsentAction[] = [];
    entityList: any[] = [];
    displayedColumns: string[] = ['action', 'actionDate', 'consentType', 'channel', 'operatedBy'];

    constructor(
        public router: Router,
        public globals: Globals,
        private route: ActivatedRoute,
        private fb: UntypedFormBuilder,
        private service: ConsentProfileDetailService
    ) {
        super(router, globals);
    }

    ngOnInit(): void {
        this.profileId = this.route.snapshot.paramMap.get('profileId') || '';
        console.log('this.profileId: ', this.profileId);
        this.createForm = this.fb.group({
            entityCode: ['']
        });

        // load dropdowns and data
        this.service.getDropdowns().then(dropdowns => {
            if (dropdowns && dropdowns['ENTITY_CODE']) {
                this.entityList = dropdowns['ENTITY_CODE'];
            }
        }).catch(() => { });

        this.loadDetail();
    }

    async loadDetail() {
        try {
            this.detail = await this.service.getDetail(this.profileId);
            this.actions = await this.service.getActions(this.profileId);
        } catch (e) {
            // swallow errors for mock
            this.detail = null;
            this.actions = [];
        }
    }

    onBack() {
        this.router.navigate(['/consent-profile']);
    }



}
