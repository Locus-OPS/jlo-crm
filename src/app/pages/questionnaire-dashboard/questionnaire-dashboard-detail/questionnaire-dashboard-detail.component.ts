import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'app-questionnaire-dashboard-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './questionnaire-dashboard-detail.component.html',
  styleUrl: './questionnaire-dashboard-detail.component.scss'
})
export class QuestionnaireDashboardDetailComponent extends BaseComponent {
  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {
    super(router, globals);
  }
}
