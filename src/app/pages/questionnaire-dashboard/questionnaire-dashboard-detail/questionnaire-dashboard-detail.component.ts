import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  questionnaireQuestionIdvList: any[];
  headerQuestionnaire: any;
  individualList: any[];
  selectedRow: any;
  displayedColumns: string[] = ['name', 'age', 'gender', 'createdDate'];
  tableControl: TableControl = new TableControl(() => { this.getRespondentList() });

  genderGroupData = [];
  ageGroupData = [];
  respondentDataList = [];
  // Chart options
  view: any[] = [550, 300];
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

  individualSearchForm: FormGroup;

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
    this.initIndividualSearchForm();
    this.getHeaderQuestionnaireDetail();
    this.getQuestionSummary();
    this.getIndividualDataList();
    this.getMainDashBoard();
    this.getRespondentList();

  }

  initIndividualSearchForm() {
    this.individualSearchForm = this.formBuilder.group({
      name: ['']
    });
  }


  onSelect(event: any): void {
    console.log(event);
  }

  getHeaderQuestionnaireDetail() {
    if (this.id != null) {
      this.questionnaireService.getQuestionnaireById({ data: { id: this.id } }).then((res) => {
        if (res.status) {
          this.headerQuestionnaire = res.data;
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
    if (this.selectedRow != null) {
      this.getQuestionnaireResponseDetail(this.selectedRow);
    }
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

  onGetRepondentList() {
    this.selectedRow = null;
    this.tableControl.resetPage();
    this.getRespondentList();
  }

  getRespondentList() {
    const name = this.individualSearchForm.get('name').value;
    this.qtnDashboardService.getRespondentList({ data: { name: name, questionnaireHeaderId: this.id }, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.respondentDataList = res.data;
        this.tableControl.total = res.total;
      }
    });
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

  getQuestionnaireResponseDetail(respondent: any) {
    this.qtnDashboardService.getQuestionnaireResponseDetail({ data: respondent }).then((res) => {
      if (res.status) {
        this.questionnaireQuestionIdvList = res.data.question;
      }
    });
  }

  exportCharts(chartId: any) {
    const svgElement = document.getElementById('chart' + (chartId))?.querySelector('svg') as SVGElement;

    if (svgElement) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        const imgURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgURL;
        link.download = `chart_${chartId}.png`;
        link.click();
      };

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      image.src = url;
    }
  }

  exportSummaryData(question: any) {
    this.qtnDashboardService.exportQuestionnaireSummaryReport({ data: { id: question.id, headerId: question.headerId, componentType: question.componentType, question: question.question } });
  }

  exportAllData() {
    this.qtnDashboardService.exportQuestionnaireSummaryListReport({ data: { id: this.id } });
  }

}
