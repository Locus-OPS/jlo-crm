import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { QuestionnaireDashboardDetailIndividualComponent } from 'src/app/pages/questionnaire-dashboard/questionnaire-dashboard-tab/questionnaire-dashboard-detail-individual/questionnaire-dashboard-detail-individual.component';
import { QuestionnaireDashboardDetailSummaryComponent } from '../questionnaire-dashboard-tab/questionnaire-dashboard-detail-summary/questionnaire-dashboard-detail-summary.component';
import { QuestionnaireService } from '../../system/questionnaire/questionnaire.service';
import { TableControl } from 'src/app/shared/table-control';
import { QuestionnaireDashboardService } from '../questionnaire-dashboard.service';

@Component({
  selector: 'app-questionnaire-dashboard-detail',
  standalone: true,
  imports: [SharedModule, NgxChartsModule, QuestionnaireDashboardDetailIndividualComponent, QuestionnaireDashboardDetailSummaryComponent],
  templateUrl: './questionnaire-dashboard-detail.component.html',
  styleUrl: './questionnaire-dashboard-detail.component.scss'
})
export class QuestionnaireDashboardDetailComponent extends BaseComponent implements OnInit {
  id: number;
  totalRespondent: any;
  questionnaireQuestionList: any[];
  headerQuestionnaire: any;
  individualList: any[];
  selectedRow: any;
  displayedColumns: string[] = ['name', 'age', 'gender', 'createdDate'];
  tableControl: TableControl = new TableControl(() => { this.getRespondentList() });

  genderGroupData = [];
  ageGroupData = [];
  respondentDataList = [
    // { name: 'Elsa A', age: 20, gender: 'Female', createdDate: '2024-09-10' },
    // { name: 'Monica B', age: 25, gender: 'Female', createdDate: '2024-09-11' },
    // { name: 'Edward C', age: 25, gender: 'Male', createdDate: '2024-09-12' },
    // { name: 'Pual D', age: 25, gender: 'Male', createdDate: '2024-09-13' }
  ]

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
    private qtnDashboardService: QuestionnaireDashboardService
  ) {
    super(router, globals);
  }
  ngOnInit(): void {
    const params = this.route.firstChild.snapshot.params;
    const { id } = params;
    this.id = id;
    this.getHeaderQuestionnaireDetail();
    this.getQuestionSummary();
    this.getIndividualDataList();
    this.getMainDashBoard();
    this.getRespondentList();
  }



  // Chart options
  view: any[] = [550, 200];
  viewQuestion: any[] = [550, 300];
  showLegend = false;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  legendPosition: string = 'below';
  colorScheme = {
    domain: [
      '#3F51B5',  // Indigo
      '#E91E63',  // Pink
      '#FFC107',  // Amber
      '#673AB7',  // Deep Purple
      '#00BCD4',  // Cyan
      '#009688',  // Teal
      '#FF9800'   // Orange
    ]
  };


  onSelect(event: any): void {
    console.log(event);
  }

  getHeaderQuestionnaireDetail() {
    if (this.id != null) {
      this.questionnaireService.getQuestionnaireById({ data: { id: this.id } }).then((res) => {
        if (res.status) {
          this.headerQuestionnaire = res.data;
          // this.questionnaireQuestionList = res.data.questionnaireList;
        } else {
          console.log(res.message);
        }
      });
    }
  }

  getIndividualDataList() {
    this.individualList = this.respondentDataList;
  }

  onRowClick(row) {
    this.selectedRow = row;
  }

  getMainDashBoard() {
    this.qtnDashboardService.getMainDashboard({ data: { headerId: this.id } }).then((res) => {
      if (res.status) {
        this.totalRespondent = res.data.totalRespondent;
        this.genderGroupData = res.data.genderGroup;
        this.ageGroupData = res.data.ageGroup;
      }
    });
  }

  getRespondentList() {
    this.qtnDashboardService.getRespondentList({ data: { questionnaireHeaderId: this.id }, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.respondentDataList = res.data;
        this.tableControl.total = res.total;
      }
    });
  }

  testTextList() {
    const objectList = [
      { name: 'Alice', value: 'Alice' },
      { name: 'Bob', value: 'Alice' },
      { name: 'Charlie', value: 'Alice' }
    ];
    return objectList;
  }

  getQuestionSummary() {
    this.qtnDashboardService.getQuestionResponseSummaryList({ data: { id: this.id } }).then((res) => {
      if (res.status) {
        this.questionnaireQuestionList = res.data.question;
      } else {
        console.log(res.message);
      }
    });
  }

  getSummaryText(questionId: number) {
    this.qtnDashboardService.getSummaryTextList({ data: { id: questionId, headerId: this.id } }).then((res) => {
      if (res.status) {
        return res.data;
      } else {
        return null;
      }

    });
  }

}
