import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, UntypedFormGroup, Validators } from '@angular/forms';
import { CreatedByComponent } from 'src/app/pages/common/created-by/created-by.component';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { QuestionnaireService } from '../questionnaire.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Dropdown } from 'src/app/model/dropdown.model';
import { QuestionnaireStore } from '../questionnaire.store';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/shared/app.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { QuestionnaireHeaderModel } from '../questionnaire.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-questionnaire-details',
  templateUrl: './questionnaire-details.component.html',
  styleUrl: './questionnaire-details.component.scss',
  standalone: true,
  imports: [SharedModule, CreatedByComponent]
})
export class QuestionnaireDetailsComponent extends BaseComponent implements OnInit, OnDestroy {


  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  createFormHeader: FormGroup;
  createFormQuestion: FormGroup;
  createFormAnswer: FormGroup;

  submitted = false;
  isReadOnly = false;
  created = false;

  statusList: Dropdown[];
  questionnaireTypeList: Dropdown[];
  questionnaireDetailSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private questionnaireService: QuestionnaireService,
    public router: Router,
    public questionnaireStore: QuestionnaireStore,
    public globals: Globals,
    private _location: Location,
    private appStore: AppStore,
    private spinner: NgxSpinnerService,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG', 'QUESTIONNAIRE_TYPE']
    }).then(result => {
      this.statusList = result.data['ACTIVE_FLAG'];
      this.questionnaireTypeList = result.data['QUESTIONNAIRE_TYPE'];
    });
  }

  ngOnDestroy() {

    console.log("questionnaireDetailSubject");
    this.questionnaireDetailSubscription.unsubscribe();
    sessionStorage.removeItem('headerId');
  }

  ngOnInit() {

    this.createFormHeader = this.formBuilder.group({
      id: [''],
      questionnaireType: ['', Validators.required],
      formName: ['', Validators.required],
      sectionHeaderText: ['', Validators.required],
      statusCd: ['', Validators.required],
      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: [''],
    });


    this.create();


    this.questionnaireDetailSubscription = this.questionnaireStore.getQuestionHeaderDetail().subscribe(detail => {
      console.log(detail);

      if (detail) {
        sessionStorage.setItem('headerId', detail.id);
        this.updateFormValue(detail);
        console.log("update from value session headerId" + sessionStorage.getItem('headerId'));
      } else {
        this.create();
      }
    });

  }


  create() {
    this.created = true;
    this.submitted = false;
    this.createFormHeader.reset();
    this.createFormHeader.patchValue({ statusCd: 'Y' });
  }

  updateFormValue(header: QuestionnaireHeaderModel) {
    console.log(header);
    this.created = false;
    this.createFormHeader.patchValue(header);
  }


  createQheader() {

  }

  saveQheader() {

  }

  onSave(event: Event) {
    this.submitted = true;

    if (this.createFormHeader.invalid) {
      Utils.alertError({
        text: 'Please, Select Customer',
      });
      return;
    }

    if (this.createFormHeader.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.createFormHeader.value
    };

    if (this.created) {
      response = this.questionnaireService.createHeaderQuestionnaire({
        data: param
      });

    } else {

      param.createdDate = '';
      param.updatedDate = '';
      param.openedDate = '';
      param.closedDate = '';
      response = this.questionnaireService.updateHeaderQuestionnaire({
        data: param
      });
    }
    console.log("data : ", param);
    response.then(result => {
      this.appStore.broadcastNewQuestionnaire({
        headerId: result.data.id

      });

      if (result.status) {
        sessionStorage.setItem('headerId', result.data.id);
        this.questionnaireStore.updateQuestionHeaderDetail(sessionStorage.getItem('headerId'));

        this.created = false;

        this.createFormHeader.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Questionnaire has been saved.',
        });
      } else {
        Utils.alertError({
          text: 'Questionnaire has not been saved.',
        });
      }
    }, () => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });

  }



  resetQheader() {
    console.log("resetQheader ");
    this.createFormHeader.reset();
    this.createFormHeader.patchValue({ statusCd: 'Y' });
    if (sessionStorage.getItem('headerId')) {
      this.questionnaireStore.updateQuestionHeaderDetail(sessionStorage.getItem('headerId'));
    }
  }

  backClicked() {
    this.questionnaireStore.clearQuestionnaireHeaderDetail();
    this._location.back();
  }

}
