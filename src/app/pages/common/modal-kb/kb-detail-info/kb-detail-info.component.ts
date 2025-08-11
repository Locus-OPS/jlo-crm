import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KbDetail, KbDetailInfo } from 'src/app/pages/kb/kb.model';
import { KbService } from 'src/app/pages/kb/kb.service';
import { KbStore } from 'src/app/pages/kb/kb.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import Utils from 'src/app/shared/utils';

@Component({
    selector: 'modal-kb-detail-info',
    imports: [SharedModule],
    templateUrl: './kb-detail-info.component.html',
    styleUrl: './kb-detail-info.component.scss'
})
export class KbDetailInfoComponent extends BaseComponent implements OnInit, OnDestroy {
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


}
