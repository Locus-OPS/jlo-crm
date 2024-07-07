import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { KbService } from '../../kb.service';
import { Subscription } from 'rxjs';
import { KbStore } from '../../kb.store';
import { KbDetail } from '../../kb.model';
import Utils from 'src/app/shared/utils';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';

interface Keyword {
  keyId?: number;
  contentId: number;
  keyword: string;
}

@Component({
  selector: 'kb-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class KeywordComponent extends BaseComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  createForm: UntypedFormGroup;

  kbDetail: KbDetail;
  keywords = [];

  creatingDocument: boolean;

  kbDetailSubscription: Subscription;

  constructor(
    private kbService: KbService,
    private kbStore: KbStore,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

    this.createForm = this.formBuilder.group({
      keyword: ['']
    });

    this.creatingDocument = false;
    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (detail && detail.contentId) {
        this.createForm.enable();
        this.kbDetail = detail;
        this.kbService.getKbKeywordList({
          data: detail.contentId
        }).then(result => {
          if (result.status) {
            this.keywords = result.data;
            this.creatingDocument = false;
          }
        });
      } else {
        this.keywords = null;
        this.creatingDocument = true;
      }
    });
  }

  ngOnDestroy() {
    this.kbDetailSubscription.unsubscribe();
  }

  ngOnInit() {
    this.createForm.disable();
    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSave() {
    this.kbService.updateKeywordByContentId({
      data: {
        keywordList: this.keywords
        , contentId: this.kbDetail.contentId
      }
    }).then(result => {
      Utils.alertSuccess({
        text: 'Keyword has been saved.',
      });
    });
  }

  remove(keyword: Keyword) {
    const index = this.keywords.findIndex(key => key.keyword === keyword.keyword);
    if (index !== -1) {
      this.keywords.splice(index, 1);
    }
  }

  add(event) {
    const index = this.keywords.findIndex(key => key.keyword === event.value);
    if (index === -1) {
      this.keywords.push({
        contentId: this.kbDetail.contentId,
        keyword: event.value
      });
    }
    if (event.input) {
      event.input.value = '';
    }
  }

}
