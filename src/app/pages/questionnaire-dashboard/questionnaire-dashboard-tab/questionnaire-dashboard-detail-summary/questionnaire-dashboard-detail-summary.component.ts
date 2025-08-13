import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionnaireService } from 'src/app/pages/system/questionnaire/questionnaire.service';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import Utils from 'src/app/shared/utils';

@Component({
    selector: 'app-questionnaire-dashboard-detail-summary',
    imports: [],
    templateUrl: './questionnaire-dashboard-detail-summary.component.html',
    styleUrl: './questionnaire-dashboard-detail-summary.component.scss'
})
export class QuestionnaireDashboardDetailSummaryComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() questionList: any;
  @Output() dataChange = new EventEmitter<string>();
  questionnaireQuestionList: any[];
  headerQuestionnaire: any;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private questionnaireService: QuestionnaireService,
  ) {
    super(router, globals);
    // this.getHeaderQuestionnaireDetail();
  }
  ngOnInit(): void {
    this.questionnaireQuestionList = this.questionList;
  }

  // getHeaderQuestionnaireDetail() {
  //   if (this.id != null) {
  //     this.questionnaireService.getQuestionnaireById({ data: { id: this.id } }).then((res) => {
  //       if (res.status) {
  //         this.headerQuestionnaire = res.data;
  //         this.questionnaireQuestionList = res.data.questionnaireList;
  //         //this.createAnswerForm();
  //       } else {
  //         console.log(res.message);
  //       }
  //     });
  //   }
  // }

  changeData() {
    this.dataChange.emit(this.id.toString());  // Emit event to parent component
  }
}
