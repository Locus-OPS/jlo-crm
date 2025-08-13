import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { KbService } from 'src/app/pages/kb/kb.service';
import { KbStore } from 'src/app/pages/kb/kb.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { KbDetailSearchbykeywordService } from './kb-detail-searchbykeyword.service';
import { TableControl } from 'src/app/shared/table-control';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { RatingComponent } from 'src/app/pages/kb/component/rating/rating.component';
import { FavoriteComponent } from 'src/app/pages/kb/component/favorite/favorite.component';
import { KbDetailDocumentComponent } from '../kb-detail-document/kb-detail-document.component';
import { KbDetailKeywordComponent } from '../kb-detail-keyword/kb-detail-keyword.component';
import { KbDetailComponent } from '../kb-detail/kb-detail.component';
import { KbDetailInfoComponent } from '../kb-detail-info/kb-detail-info.component';
import { CasekbService } from 'src/app/pages/case/casekb/casekb.service';
import Utils from 'src/app/shared/utils';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'kb-detail-search-bykeyword',
    imports: [SharedModule, RatingComponent, FavoriteComponent, KbDetailDocumentComponent, KbDetailKeywordComponent, KbDetailComponent, KbDetailInfoComponent],
    templateUrl: './kb-detail-search-bykeyword.component.html',
    styleUrl: './kb-detail-search-bykeyword.component.scss'
})
export class KbDetailSearchBykeywordComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Output() returnEvent = new EventEmitter<boolean>();
  kbDetailSubscription: Subscription;
  tableControl: TableControl = new TableControl(() => { this.getKBbyKeyword(); });
  searchForm: FormGroup;
  createForm: FormGroup;
  displayedColumns: string[] = ['keyword', 'title', 'description', 'url'];
  datasorce: any;
  selectedRow: any;
  constructor
    (
      private kbService: KbService,
      private kbStore: KbStore,
      private formBuilder: UntypedFormBuilder,
      public router: Router,
      public globals: Globals,
      public keywordService: KbDetailSearchbykeywordService,
      private caseKbService: CasekbService
    ) {
    super(router, globals);

  }
  ngOnInit(): void {
    this.initSearchForm();
    this.initCreateForm();
  }
  ngOnDestroy(): void {

  }

  initSearchForm() {
    this.searchForm = this.formBuilder.group({
      keyword: ['']
    });
  }

  initCreateForm() {
    this.createForm = this.formBuilder.group({
      kbId: [''],
      caseNumber: ['']
    });
  }

  onGetKBbyKeyword() {
    this.tableControl.resetPage();
    this.getKBbyKeyword();
  }

  getKBbyKeyword() {
    this.selectedRow = null;
    const param = this.searchForm.getRawValue();
    this.keywordService.getKbByKeywordList({ data: param, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.datasorce = res.data;
        this.tableControl.total = res.total;
      } else {
        console.log(res.message);
      }
    });
  }

  onSelectRow(element: any) {
    this.selectedRow = element;
    this.createForm.patchValue({ kbId: element.contentId, caseNumber: this.data.caseNumber });
    this.kbStore.updateKbDetail(parseInt(element.contentId, 10));
  }

  onCreateRefKB() {
    const param = this.createForm.getRawValue();
    this.caseKbService.createRefKB({ data: { ...param } }).then((res) => {
      if (res.status) {
        this.returnEvent.emit(true);
      } else {
        Utils.alertError({
          text: res.message
        });
        this.returnEvent.emit(false);

      }
    })
  }



}
