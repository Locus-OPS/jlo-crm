import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, UntypedFormGroup, Validators } from '@angular/forms';
import { CreatedByComponent } from 'src/app/pages/common/created-by/created-by.component';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { QuestionnaireService } from '../questionnaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Dropdown } from 'src/app/model/dropdown.model';
import { QuestionnaireStore } from '../questionnaire.store';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/shared/app.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { QuestionnaireHeaderModel, QuestionnaireQuestionModel } from '../questionnaire.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import Utils from 'src/app/shared/utils';
import { CodebookData } from '../../codebook/codebook.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableControl } from 'src/app/shared/table-control';

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
  id: number;
  answerType: CodebookData[] = [];
  addListForm: FormGroup;
  textList: string[] = [];
  multichoice = ['03', '04', '05'];
  questionnaireQuestionList: any[];

  tableControl: TableControl = new TableControl(() => { this.getQuestionnaireQuestionList(); });
  displayedColumns: string[] = ['seqNo', 'question', 'answerType', 'description', 'action'];
  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private questionnaireService: QuestionnaireService,
    public router: Router,
    private route: ActivatedRoute,
    public questionnaireStore: QuestionnaireStore,
    public globals: Globals,
    private _location: Location,
    private appStore: AppStore,
    private spinner: NgxSpinnerService
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
    const params = this.route.firstChild.snapshot.params;
    const { id } = params;
    this.id = id;
    //ฟอร์มสำหรับสร้าง Header
    this.createFormHeader = this.formBuilder.group({
      id: [this.id],
      questionnaireType: ['', Validators.required],
      formName: ['', Validators.required],
      sectionHeaderText: ['', Validators.required],
      statusCd: ['Y', Validators.required],
      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: [''],
    });

    //ฟอร์มสำหรับสร้างคำถาม
    this.createFormQuestion = this.formBuilder.group({
      id: [],
      headerId: ['', Validators.required],
      question: ['', Validators.required],
      answerType: ['01', Validators.required],
      description: [''],
      imageUrl: [],
      statusCd: [''],
      requiredFlg: [true],
      seqNo: [1, Validators.required]
    });

    this.addListForm = this.formBuilder.group({
      itemText: ['', Validators.required], // Text input field
      items: this.formBuilder.array([]) // FormArray to hold the list items
    });

    this.getCodeBook();
    this.getHeaderQuestionnaireDetail();
    // this.create();


    // this.questionnaireDetailSubscription = this.questionnaireStore.getQuestionHeaderDetail().subscribe(detail => {
    //   console.log(detail);

    //   if (detail) {
    //     sessionStorage.setItem('headerId', detail.id);
    //     this.updateFormValue(detail);
    //     console.log("update from value session headerId" + sessionStorage.getItem('headerId'));
    //   } else {
    //     this.create();
    //   }
    // });

  }

  get items(): FormArray {
    return this.addListForm.get('items') as FormArray;
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.createFormHeader.reset();
    this.createFormHeader.patchValue({ statusCd: 'Y' });
  }

  getCodeBook() {
    this.api.getMultipleCodebookByCodeType({ data: ['ANSWER_TYPE'] }).then(result => {
      this.answerType = result.data['ANSWER_TYPE'];
    });
  }

  getHeaderQuestionnaireDetail() {
    if (this.id != null) {

      this.questionnaireService.getQuestionnaireById({ data: { id: this.id } }).then((res) => {
        if (res.status) {
          this.createFormHeader.patchValue({ ...res.data });
          this.getQuestionnaireQuestionList();
        } else {
          Utils.alertError({ text: res.message });
        }
      });
      this.createFormQuestion.patchValue({ headerId: this.id });
    }

  }


  updateFormValue(header: QuestionnaireHeaderModel) {
    console.log(header);
    this.created = false;
    this.createFormHeader.patchValue(header);
  }


  onSaveQheder() {
    if (this.createFormHeader.get('id').value != null) {
      //Edit
      this.editQheader();
    } else {
      //Save
      this.saveQheader();
    }
  }

  saveQheader() {
    if (!this.createFormHeader.valid) {
      return;
    }
    const params = this.createFormHeader.getRawValue();

    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          this.questionnaireService.createHeaderQuestionnaire({ data: params }).then((res) => {
            if (res.status) {
              this.id = res.data.id;
              Utils.alertSuccess({ text: 'Header questionnaire has been added.' });
              this.getHeaderQuestionnaireDetail();
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });


  }

  editQheader() {
    if (!this.createFormHeader.valid) {
      return;
    }
    const params = this.createFormHeader.getRawValue();
    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          this.questionnaireService.updateHeaderQuestionnaire({ data: params }).then((res) => {
            if (res.status) {
              this.createFormHeader.patchValue({ ...res.data });
              Utils.alertSuccess({ text: "Header questionnaire has been updated." })
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });

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

  addItem(): void {
    const itemText = this.addListForm.get('itemText').value;
    if (itemText) {
      this.items.push(this.formBuilder.control(itemText));
      this.addListForm.get('itemText').reset(); // Clear the input field after adding
    }
  }

  removeItem(index: number): void {
    this.items.removeAt(index); // Remove the item at the specified index
  }

  onCreateQuestion() {

  }

  getQuestionnaireQuestionList() {
    if (this.id != null) {
      this.questionnaireService.getQuestionnaireQuestionList({ data: { headerId: this.id } }).then((res) => {
        if (res.status) {
          this.questionnaireQuestionList = res.data;
        }
      });
    }
  }

  onSubmitQuestionnaire() {
    if (!this.createFormQuestion.valid) {
      return;
    }
    const choiceStr = this.items.value.join(' , ');
    if (this.multichoice.includes(this.createFormQuestion.get('answerType').value)) {
      if (choiceStr == "" || choiceStr == null) {
        Utils.alertError({ text: "Please fill data." });
        return;
      }
      this.createFormQuestion.patchValue({ description: choiceStr });
    }
    const params = this.createFormQuestion.getRawValue();
    this.questionnaireService.createQuestionnaireQuestion({ data: params }).then((res) => {
      if (res.status) {
        this.getQuestionnaireQuestionList();
        Utils.alertSuccess({ text: 'Questionnaire has been created.' });
      } else {
        Utils.alertError({ text: res.message });
      }
    });
  }

}
