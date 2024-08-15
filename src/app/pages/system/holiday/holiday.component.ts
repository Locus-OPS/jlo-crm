import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodebookData } from '../codebook/codebook.model';
import { HolidayServiceService } from './holiday-service.service';
import moment from 'moment';


interface Holiday {
  date: Date;
  name: string;
}

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [
    SharedModule, CreatedByComponent
  ],
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['date', 'name'];
  holidayData: any[] = [];
  currentDate: string;
  holidayForm: FormGroup;
  holidayTypes: CodebookData[] = [];
  selectedRow: any;

  @ViewChild('holidayDateInput') holidayDateInputElement: ElementRef;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private modal: NgbModal,
    private fb: FormBuilder,
    private holidayService: HolidayServiceService
  ) {
    super(router, globals);

  }
  ngOnInit(): void {
    this.getCodebook();
    this.currentDate = this.getCurrentDate();
    this.getHolidayList();
    this.initForm();
  }

  initForm() {
    this.holidayForm = this.fb.group({
      id: [''],
      year: [''],
      holidayDate: ['', Validators.required],
      holidayName: ['', Validators.required],
      typeCd: ['', Validators.required],
      remark: ['']
    });
  }

  getCodebook() {
    this.api.getMultipleCodebookByCodeType({ data: ['HOLIDAY_TYPE'] }).then(result => {
      this.holidayTypes = result.data['HOLIDAY_TYPE'];
    });
  }

  addHoliday() {
    if (this.holidayForm.valid) {
      this.holidayData.push(this.holidayForm.value);
      this.holidayForm.reset();
    }
  }

  getHolidayList() {
    this.holidayService.getHolidayList({
      data: { year: 2024 }
    }).then(result => {
      if (result.status) {
        this.holidayData = result.data;
      }
    });
  }

  onSaveHoliday() {
    if (!this.holidayForm.valid) {
      return;
    }
    const param = this.holidayForm.getRawValue();

    this.holidayService.saveHoliday({ data: { ...param, year: 2024 } }).then((result) => {
      if (result.status) {
        this.holidayForm.reset();
        this.getHolidayList();
        this.holidayDateInputElement.nativeElement.focus();
      }
    });
  }

  onEditHoliday() {
    if (!this.holidayForm.valid) {
      return;
    }
    const params = this.holidayForm.getRawValue();
    this.holidayService.editHoliday({ data: params }).then((result) => {
      if (result.status) {
        this.getHolidayList();
        this.holidayForm.reset();
        this.holidayDateInputElement.nativeElement.focus();
      }
    });
  }

  onDeleteHoliday() {
    if (!this.holidayForm.valid) {
      return;
    }
    const params = this.holidayForm.getRawValue();
    this.holidayService.deleteHoliday({ data: params }).then((result) => {
      if (result.status) {
        this.getHolidayList();
        this.holidayForm.reset();
        this.holidayDateInputElement.nativeElement.focus();
      }
    });
  }

  getCurrentDate(): string {
    return moment().format('MMMM yyyy');
  }

  onRowClick(row) {
    this.selectedRow = row;
    this.holidayForm.patchValue({ ...row });
    this.holidayDateInputElement.nativeElement.focus();
  }

}
