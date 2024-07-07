import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { KbDetail, KbDetailInfo } from '../../kb.model';
import { KbService } from '../../kb.service';
import { KbStore } from '../../kb.store';
import Utils from 'src/app/shared/utils';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'kb-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class DetailInfoComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  translatePrefix: string;

  createForm: UntypedFormGroup;
  kbDetailSubscription: Subscription;
  kbDetail: KbDetail = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private kbService: KbService,
    private kbStore: KbStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (detail && detail.contentId) {
        this.createForm.enable();
        this.kbDetail = detail;
        this.kbService.getKbDetailInfoById({
          data: detail.contentId
        }).then(result => {
          if (result.status) {
            this.updateFormValue(result.data);
          }
        });
      } else {
        this.kbDetail = null;
        this.createForm.reset();
      }
    });
  }
  ngOnDestroy(): void {
    this.kbDetailSubscription.unsubscribe();
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      contentId: [''],
      url: [''],
      description: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  clearForm() {
    this.createForm.reset();
  }

  updateFormValue(kbDetailInfo: KbDetailInfo) {
    this.createForm.patchValue({
      ...kbDetailInfo
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    this.kbService.saveKbDetailInfo({
      data: {
        ...this.createForm.value
      }
    }).then(result => {
      if (result.status) {
        this.updateFormValue(result.data);
        Utils.alertSuccess({
          title: 'Updated!',
          text: 'KB Detail Info has been updated.',
        });
      }
    });
  }
}
