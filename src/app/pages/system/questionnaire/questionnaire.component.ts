import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { QuestionnaireHeaderModel } from './questionnaire.model';
import { ApiService } from 'src/app/services/api.service';
import { QuestionnaireService } from './questionnaire.service';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { QuestionnaireStore } from './questionnaire.store';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent extends BaseComponent implements OnInit {

  searchForm: FormGroup;
  createForm: FormGroup;

  statusList: Dropdown[];
  questionnaireTypeList: Dropdown[];

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: QuestionnaireHeaderModel;
  dataSource: QuestionnaireHeaderModel[];
  displayedColumns: string[] = ['id', 'buName', 'activeYn'];

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private questionnaireService: QuestionnaireService,
    public router: Router,
    public globals: Globals,
    private questionnaireStore: QuestionnaireStore,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG', 'QUESTIONNAIRE_TYPE']
    }).then(result => {
      this.statusList = result.data['ACTIVE_FLAG'];
      this.questionnaireTypeList = result.data['QUESTIONNAIRE_TYPE'];
    });
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      formname: [''],
      activeYn: [null],
      questionnaireType: [null],
    });

    this.createForm = this.formBuilder.group({
      id: [null],
      formname: ['', [Validators.required, Validators.maxLength(100)]],
      activeYn: ['N'],
      questionnaireType: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      updatedByName: [''],
      createdByName: ['']
    });
    this.search();
  }

  onSearch() {

  }

  search() {

  }

  onQuestionnaireCreate() {
    sessionStorage.removeItem('headerId');
    this.questionnaireStore.clearQuestionnaireHeaderDetail();
  }


}
