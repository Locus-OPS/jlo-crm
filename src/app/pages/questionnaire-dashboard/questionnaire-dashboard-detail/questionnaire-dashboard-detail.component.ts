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

@Component({
  selector: 'app-questionnaire-dashboard-detail',
  standalone: true,
  imports: [SharedModule, NgxChartsModule, QuestionnaireDashboardDetailIndividualComponent, QuestionnaireDashboardDetailSummaryComponent],
  templateUrl: './questionnaire-dashboard-detail.component.html',
  styleUrl: './questionnaire-dashboard-detail.component.scss'
})
export class QuestionnaireDashboardDetailComponent extends BaseComponent implements OnInit {
  id: number;
  questionnaireQuestionList: any[];
  headerQuestionnaire: any;
  individualList: any[];
  selectedRow: any;
  displayedColumns: string[] = ['name', 'age', 'gender', 'createdDate'];
  tableControl: TableControl = new TableControl(() => { });

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
  }
  ngOnInit(): void {
    const params = this.route.firstChild.snapshot.params;
    const { id } = params;
    this.id = id;
    this.getHeaderQuestionnaireDetail();
    this.getIndividualDataList();
  }



  // Chart options
  view: any[] = [550, 200];
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

  //  Mock up data
  genderData = [
    {
      "name": "Male",
      "value": 150
    },
    {
      "name": "Female",
      "value": 130
    }
  ];

  ageGroupData = [
    {
      "name": "น้อยกว่า 15 ปี",
      "value": 50
    },
    {
      "name": "อายุ 16-25 ปี",
      "value": 120
    },
    {
      "name": "มากกว่า 25 ปี",
      "value": 110
    }
  ];

  individualDataList = [
    { name: 'Elsa A', age: 20, gender: 'Female', createdDate: '2024-09-10' },
    { name: 'Monica B', age: 25, gender: 'Female', createdDate: '2024-09-11' },
    { name: 'Edward C', age: 25, gender: 'Male', createdDate: '2024-09-12' },
    { name: 'Pual D', age: 25, gender: 'Male', createdDate: '2024-09-13' }
  ]

  onSelect(event: any): void {
    console.log(event);
  }

  getHeaderQuestionnaireDetail() {
    if (this.id != null) {
      this.questionnaireService.getQuestionnaireById({ data: { id: this.id } }).then((res) => {
        if (res.status) {
          this.headerQuestionnaire = res.data;
          this.questionnaireQuestionList = res.data.questionnaireList;
        } else {
          console.log(res.message);
        }
      });
    }
  }

  getIndividualDataList() {
    this.individualList = this.individualDataList;
  }

  onRowClick(row) {
    this.selectedRow = row;
    //this.createFormQuestion.patchValue({ ...row });
    // const optionsArray = row.options.split(',').map(item => item.trim());
    // this.items.clear();
    // optionsArray.forEach(item => {
    //   this.items.push(this.formBuilder.control(item));
    //   this.addListForm.get('itemText').reset();
    // });
  }

}
