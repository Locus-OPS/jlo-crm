import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/shared/base.component';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    SharedModule, CreatedByComponent
  ],
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent extends BaseComponent implements OnInit, AfterViewInit {

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

  ngAfterViewInit(): void {
    console.log('Method not implemented.');
  }

  ngOnInit(): void {

  }
}
