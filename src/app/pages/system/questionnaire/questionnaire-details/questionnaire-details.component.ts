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
      formName: [''],
      sectionHeaderText: [''],
      statusCd: [''],
      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: [''],
    });
  }

  createQheader() {

  }
  resetQheader() {

  }
  saveQheader() {

  }

  onSave(event: Event) {

  }


  backClicked() {
    this.questionnaireStore.clearQuestionnaireHeaderDetail();
    this._location.back();
  }

}
