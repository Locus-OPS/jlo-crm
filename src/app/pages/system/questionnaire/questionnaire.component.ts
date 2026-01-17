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
import Utils from 'src/app/shared/utils';

@Component({
    selector: 'app-questionnaire',
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
  displayedColumns: string[] = ['formname', 'questionnaireType', 'status', 'action'];

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
      formName: [''],
      statusCd: ['Y'],
      questionnaireType: [null],
    });

    this.createForm = this.formBuilder.group({
      id: [null],
      formName: [''],
      statusCd: ['Y'],
      questionnaireType: [''],
      sectionHeaderText: [],
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
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    const params = this.searchForm.getRawValue();
    this.questionnaireService.getHeaderQuestionnaireList({ data: params, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.dataSource = res.data;
        this.tableControl.total = res.total;
      } else {
        Utils.alertError({ text: res.message });
      }
    });
  }

  onDeleteheaderQuestionaire(headerQuestionaire: any) {

    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          this.questionnaireService.updateHeaderQuestionnaire({ data: { ...headerQuestionaire, statusCd: 'N' } }).then((res) => {
            if (res.status) {
              this.search();
              Utils.alertSuccess({ text: 'ลบแบบสอบถามสำเร็จ' })
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });

  }

  onQuestionnaireCreate() {
    sessionStorage.removeItem('headerId');
    this.questionnaireStore.clearQuestionnaireHeaderDetail();
  }

  onClickQuestionnaireDetail(headerQuestionnaire: any) {
    this.router.navigate(["/system/questionnaire-details", { id: headerQuestionnaire.id }]);
  }

  onReset() {
    this.searchForm.reset();
    this.searchForm.patchValue({ statusCd: 'Y' });
  }



  onGenerateLink() {
    // if (this.createForm.invalid) {
    //   return true;
    // }

    this.questionnaireService.generateSmartLink({
      data: this.createForm.value
    }).then(result => {
      if (result.status) {
        this.createForm.patchValue({
          linkUrl: result.data
        });
      } else {
        Utils.alertError({
          text: result.message
        });
      }
    });
  }

  onGotoQuestionnaireLandingPage(element) {
    window.open(element.urlLink, "_blank");
  }

  onGotoQuestionnaireDashboard(element) {
    this.router.navigate(["/dashboard/questionnaire-dashboard-detail", { id: element.id }]);
  }

}
