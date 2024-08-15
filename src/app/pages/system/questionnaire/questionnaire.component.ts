import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { QuestionnaireModel } from './questionnaire.model';
import { ApiService } from 'src/app/services/api.service';
import { QuestionnareService } from './questionnare.service';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';

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
  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: QuestionnaireModel;
  dataSource: QuestionnaireModel[];
  displayedColumns: string[] = ['id', 'buName', 'activeYn'];

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private questionnareService: QuestionnareService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' })
      .then(result => { this.statusList = result.data; });
  }

  ngOnInit(): void {

  }

  onSearch() {

  }

  search() {

  }

}
