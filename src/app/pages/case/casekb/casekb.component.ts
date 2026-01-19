import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CasekbService } from './casekb.service';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ModalKbComponent } from '../../common/modal-kb/modal-kb.component';
import { MatDialog } from '@angular/material/dialog';
import { KbStore } from '../../kb/kb.store';
import { RatingComponent } from '../../kb/component/rating/rating.component';
import { FavoriteComponent } from '../../kb/component/favorite/favorite.component';
import { KbDetailDocumentComponent } from '../../common/modal-kb/kb-detail-document/kb-detail-document.component';
import { KbDetailKeywordComponent } from '../../common/modal-kb/kb-detail-keyword/kb-detail-keyword.component';
import { KbDetailComponent } from '../../common/modal-kb/kb-detail/kb-detail.component';
import { KbDetailInfoComponent } from '../../common/modal-kb/kb-detail-info/kb-detail-info.component';

@Component({
    selector: 'tab-casekb-content',
    imports: [SharedModule, RatingComponent, FavoriteComponent, KbDetailDocumentComponent, KbDetailKeywordComponent, KbDetailComponent, KbDetailInfoComponent],
    templateUrl: './casekb.component.html',
    styleUrl: './casekb.component.scss'
})
export class CasekbComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() caseNumber!: string;
  searchForm: FormGroup;
  kbDetailForm: FormGroup;
  tableControl: TableControl = new TableControl(() => { this.searchKB(); });
  displayedColumns: string[] = ['kbId', 'title', 'description', 'action'];
  caseKBSource: any[];
  selectedRow: any;
  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals,
    private caseKBservice: CasekbService,
    public dialog: MatDialog,
    private kbStore: KbStore,
  ) {
    super(router, globals);
  }
  ngOnDestroy(): void {
    //this.caseDetailSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.initialSearchForm();
    this.initialKBDetailForm();
    this.getKBList();
    // this.kbDetailForm.disable();
  }

  initialSearchForm() {
    this.searchForm = this.formBuilder.group({
      caseNumber: ['']
    });
  }

  initialKBDetailForm() {
    this.kbDetailForm = this.formBuilder.group({
      kbid: [''],
      url: [''],
      kbTitle: [''],
      description: ['']
    });
  }

  getKBList() {

    this.searchForm.patchValue({ caseNumber: this.caseNumber });
    this.searchKB();
  }

  searchKB() {
    const param = this.searchForm.getRawValue();
    this.caseKBservice.getRefKBList({ data: param, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize })
      .then((result) => {
        if (result.status) {
          this.caseKBSource = result.data;
          this.tableControl.total = result.total;
        } else {
          console.error(result.message);
          Utils.alertError({
            text: 'กรุณาลองใหม่ภายหลัง',
          });
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
        });
      });

  }
  onActCreate() {
    const dialogRef = this.dialog.open(ModalKbComponent, {
      width: '90%',
      height: '85%',
      panelClass: 'my-dialog',
      data: {
        caseNumber: this.searchForm.get('caseNumber').value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getKBList();
      }
      console.log('Modal closed with:', result);
    });
  }

  onActDelete(element) {
    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          this.caseKBservice.deleteRefKB({ data: element }).then((res) => {
            if (res.status) {
              this.searchKB();
              this.selectedRow = null;
            }
          });
        } else {
          console.log('Cancelled');
        }
      });
  }

  onSelectRow(element: any) {
    this.selectedRow = element;
    //this.kbDetailForm.patchValue({ kbId: element.kbId, url: element.url, kbTitle: element.kbTitle, description: element.description });
    this.kbStore.updateKbDetail(parseInt(element.kbId, 10));
  }


}
