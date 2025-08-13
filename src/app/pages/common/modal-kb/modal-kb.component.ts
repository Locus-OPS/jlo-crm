import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TreeComponent } from '../../kb/component/tree/tree.component';
import { DetailComponent } from '../../kb/component/detail/detail.component';
import { DetailInfoComponent } from '../../kb/component/detail-info/detail-info.component';
import { MainDocumentComponent } from '../../kb/component/main-document/main-document.component';
import { DocumentComponent } from '../../kb/component/document/document.component';
import { KeywordComponent } from '../../kb/component/keyword/keyword.component';
import { KbDetailComponent } from './kb-detail/kb-detail.component';
import { KbDetailInfoComponent } from './kb-detail-info/kb-detail-info.component';
import { Subscription } from 'rxjs';
import { KbStore } from '../../kb/kb.store';
import { KbService } from '../../kb/kb.service';
import { CasekbService } from '../../case/casekb/casekb.service';
import Utils from 'src/app/shared/utils';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { RatingComponent } from '../../kb/component/rating/rating.component';
import { FavoriteComponent } from '../../kb/component/favorite/favorite.component';
import { KbDetailDocumentComponent } from './kb-detail-document/kb-detail-document.component';
import { KbDetailKeywordComponent } from './kb-detail-keyword/kb-detail-keyword.component';
import { KbDetailSearchBykeywordComponent } from './kb-detail-search-bykeyword/kb-detail-search-bykeyword.component';

@Component({
    selector: 'app-modal-kb',
    imports: [SharedModule, TreeComponent, KbDetailComponent, KbDetailInfoComponent, DetailComponent, DetailInfoComponent, MainDocumentComponent, DocumentComponent, KeywordComponent, RatingComponent, FavoriteComponent, KbDetailDocumentComponent, KbDetailKeywordComponent, KbDetailSearchBykeywordComponent],
    templateUrl: './modal-kb.component.html',
    styleUrl: './modal-kb.component.scss'
})
export class ModalKbComponent extends BaseComponent implements OnInit {
  kbDetailSubscription: Subscription;
  kbTreeSubscription: Subscription;
  kbDetail: any = null;
  createForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalKbComponent>,
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    private kbStore: KbStore,
    private kbService: KbService,
    private caseKbService: CasekbService
  ) {
    super(router, globals);
    this.initCreateForm();

    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (detail && detail.contentId) {
        this.kbService.getKbDetailInfoById({
          data: detail.contentId
        }).then(result => {
          if (result.status) {
            this.createForm.patchValue({ kbId: result.data.contentId, caseNumber: this.data.caseNumber });
          }
        });
      } else {
        this.createForm.patchValue({ kbId: null, caseNumber: null });
      }
    });
  }

  ngOnInit(): void {
    this.kbStore.loadKbContentType("Content");
  }

  close(isSuccess: boolean): void {
    // ส่งค่ากลับไปยัง component ที่เปิด modal
    this.dialogRef.close(isSuccess);
  }

  initCreateForm() {
    this.createForm = this.formBuilder.group({
      caseNumber: [''],
      kbId: [null]
    });
  }


  onCreateRefKB() {
    const param = this.createForm.getRawValue();
    this.caseKbService.createRefKB({ data: { ...param } }).then((res) => {
      if (res.status) {
        this.close(true);
      } else {
        Utils.alertError({
          text: res.message
        });
        this.close(false)
      }
    })
  }

}
