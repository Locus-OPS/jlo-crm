import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { QuestionnaireService } from '../questionnaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { QuestionnaireStore } from '../questionnaire.store';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from 'src/app/pages/common/created-by/created-by.component';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-questionnaire-preview',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './questionnaire-preview.component.html',
  styleUrl: './questionnaire-preview.component.scss'
})
export class QuestionnairePreviewComponent extends BaseComponent implements OnInit {
  id: number;
  questionnaireQuestionList: any[];
  headerQuestionnaire: any;
  answerForm: FormGroup;
  respondentForm: FormGroup;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private questionnaireService: QuestionnaireService,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals,
    private questionnaireStore: QuestionnaireStore,
  ) {
    super(router, globals);

  }

  ngOnInit(): void {
    const params = this.route.firstChild.snapshot.params;
    const { id } = params;
    this.id = id;
    this.createRespondentForm();
    this.getHeaderQuestionnaireDetail();

  }

  getHeaderQuestionnaireDetail() {
    if (this.id != null) {
      this.questionnaireService.getQuestionnaireById({ data: { id: this.id } }).then((res) => {
        if (res.status) {
          // this.createFormHeader.patchValue({ ...res.data });
          this.headerQuestionnaire = res.data;
          this.questionnaireQuestionList = res.data.questionnaireList;
          // this.getQuestionnaireQuestionList();
          this.createAnswerForm();
        } else {
          Utils.alertError({ text: res.message });
        }
      });
      // this.createFormQuestion.patchValue({ headerId: this.id });
    }
  }

  createAnswerForm() {
    const group = {};
    this.questionnaireQuestionList.forEach(q => {
      if (q.componentType === 'text') {
        group[q.id] = ['', q.requiredFlg ? Validators.required : null];
      } else {
        group[q.id] = ['', q.requiredFlg ? Validators.required : null];
      }
    });
    this.answerForm = this.formBuilder.group(group);
  }

  createRespondentForm() {
    this.respondentForm = this.formBuilder.group({
      respondentId: [],
      questionnaireHeaderId: [this.id, Validators.required],
      name: [null, Validators.required],
      age: [null, Validators.required],
      gender: [null, Validators.required],
      location: [null],
    });
  }

}
