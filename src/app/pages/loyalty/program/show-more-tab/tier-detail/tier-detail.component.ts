import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { TierData } from '../tier-tab/tier-data';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { TierService } from '../tier-tab/tier.service';
import Utils from 'src/app/shared/utils';
import { Subscription } from 'rxjs';
import { TierStore } from '../tier-tab/tier.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ProgramData } from '../../program-data';
import { ProgramStore } from '../../program.store';

@Component({
  selector: 'app-tier-detail',
  templateUrl: './tier-detail.component.html',
  styleUrls: ['./tier-detail.component.scss']
})
export class TierDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  programSubscription: Subscription;
  programData: ProgramData;

  tierSubscription: Subscription;
  tierData: TierData;

  createForm: UntypedFormGroup;

  submitted = false;
  created = false;
  isShowMoreTab = false;
  isReadOnly = false;

  dataSource: TierData;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private tierService: TierService,
    private tierStore: TierStore,
    private programStore: ProgramStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      tierId: [''],
      tierCode: ['', Validators.required],
      tier: ['', Validators.required],
      tierLevel: ['', Validators.required],
      spending: ['', Validators.required],
      point: ['', Validators.required],
      activeFlag: [''],
      baseFlag: [''],
      previousBaseFlag: [''],
      limitSpendingPerTime: [''],
      limitSpendingPerDay: [''],
      limitSpendingPerMonth: [''],

      remark: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);

    this.programSubscription = this.programStore.getProgram().subscribe(program => {
      if (program) {
        this.programData = program;
      }
    });

    this.tierSubscription = this.tierStore.getTier().subscribe(tier => {
      if (tier) {
        this.tierData = tier;
        if (!this.tierData.tierId) { // Create action
          this.createForm.reset();
          if (this.createFormDirective) {
            this.createFormDirective.resetForm();
          }
          this.createForm.patchValue({ 'previousBaseFlag':  false});
        } else {
          this.createForm.patchValue(this.tierData);
          Utils.convertToBoolean(this.tierData, this.createForm, 'activeFlag');
          Utils.convertToBoolean(this.tierData, this.createForm, 'baseFlag');
          this.createForm.patchValue({ 'previousBaseFlag':  this.createForm.value['baseFlag']});
        }
      }
    });
  }

  ngOnDestroy() {
    this.tierSubscription.unsubscribe();
    this.programSubscription.unsubscribe();
  }

  onSave(e) {
    if (this.createForm.invalid) {
      return;
    }

    let baseFlag = this.createForm.value['baseFlag'];
    let previousBaseFlag = this.createForm.value['previousBaseFlag'];
    if (baseFlag && !previousBaseFlag) {
      this.tierService.getPrimaryTier({
        data: {
          programId: this.programData.programId
        }
      }).then(result => {
        if (result.data) {
          let tierName = result.data.tier;
          Utils.confirm("Warning", "Save this tier as a primary will remove primary flag from \"" + tierName + "\" tier, do you want to save this tier?", "Save Tier").then(confirm => {
            if (confirm.value) {
              this.save(result.data.tierId);
            }
          });
        } else {
          this.save(null);
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later - from Tier Service.',
        });
      });
    } else {
      this.save(null);
    }
  }

  save(removePrimaryTierId: number) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Tier has been created.!' : 'Tier has been updated.';
    const param = {
      ...this.createForm.value
      , programId: this.programData.programId
      , activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
      , baseFlag: Utils.convertToYN(this.createForm.value['baseFlag'])
      , removePrimaryTierId: removePrimaryTierId
    };
    this.tierService.saveTier({
      data: param
    }).then(result => {
      if (result.status) {
        this.tierStore.updateTier(result.data);
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        if (removePrimaryTierId) {
          this.programStore.selectProgram(this.programData);
        }
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later - from TierService',
      });
    });
  }

}
