import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
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
import { CalendarOptions, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { format, parseISO } from 'date-fns';
import Utils from 'src/app/shared/utils';

interface Holiday {
  date: Date;
  name: string;
}

@Component({
  selector: 'app-holiday',
  imports: [
    SharedModule
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
  events: { title: string; date: string; color: string, textColor: string, extendedProps: { id: string } }[] = [];
  calendarEl = document.getElementById('calendar');
  selectedYear: number;
  currentYear: number;
  eventsPromise: Promise<EventInput[]>;

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
    private holidayService: HolidayServiceService,
    private changeDetector: ChangeDetectorRef
  ) {
    super(router, globals);

  }

  ngOnInit(): void {
    this.selectedYear = moment().year();
    this.currentYear = moment().year();
    this.initForm();
    this.getCodebook();
    this.currentDate = this.getCurrentDate();
    this.getHolidayList();
  }

  initForm() {
    this.holidayForm = this.fb.group({
      id: [''],
      year: [this.selectedYear],
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
      data: { year: this.currentYear }
    }).then(result => {
      if (result.status) {
        this.events = [];

        result.data.forEach(item => {
          this.events.push({
            title: item.holidayName,
            date: moment(item.holidayDate).format('YYYY-MM-DD'),
            color: item.backgroundColor,
            textColor: item.textColor,
            extendedProps: { id: item.id }
          });
        });
        this.calendarOptions.events = [
          ...this.events as any[],
        ];

        this.holidayData = result.data.filter(item => item.year === this.currentYear);
      }
    });
  }

  getHolidayDetail(id: number) {
    this.holidayService.getHolidayDetail({ data: { id: id } }).then((result) => {
      if (result.status) {
        this.holidayForm.patchValue({ ...result.data });
      }
    });
  }

  onSaveHoliday() {
    if (!this.holidayForm.valid) {
      return;
    }
    const param = this.holidayForm.getRawValue();
    const year = moment(this.holidayForm.get('holidayDate').value).year();

    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          this.holidayService.saveHoliday({ data: { ...param, year: year } }).then((res) => {
            if (res.status) {
              this.holidayForm.reset();
              this.holidayForm.patchValue({ year: this.selectedYear });
              this.getHolidayList();
              this.holidayDateInputElement.nativeElement.focus();
              Utils.alertSuccess({ text: 'บันทึกวันหยุดสำเร็จ' });
            } else {
              Utils.alertError({ text: res.message });
            }
          });

        } else {
          console.log('Cancelled');
        }
      });

  }

  onEditHoliday() {
    if (!this.holidayForm.valid) {
      return;
    }
    const params = this.holidayForm.getRawValue();

    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          this.holidayService.editHoliday({ data: params }).then((res) => {
            if (res.status) {
              this.holidayForm.reset();
              this.holidayForm.patchValue({ year: this.selectedYear });
              this.getHolidayList();
              this.holidayDateInputElement.nativeElement.focus();
              Utils.alertSuccess({ text: 'อัปเดตวันหยุดสำเร็จ' });
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          // ดำเนินการเมื่อผู้ใช้คลิกปุ่ม "Cancel"
          console.log('Cancelled');
        }
      });

  }

  onDeleteHoliday() {
    if (!this.holidayForm.valid) {
      return;
    }
    const params = this.holidayForm.getRawValue();

    Utils.confirm('คุณแน่ใจหรือไม่?', 'คุณต้องการดำเนินการต่อหรือไม่?', 'ใช่')
      .then((result) => {
        if (result.isConfirmed) {
          this.holidayService.deleteHoliday({ data: params }).then((res) => {
            if (res.status) {
              this.holidayForm.reset();
              this.holidayForm.patchValue({ year: this.selectedYear });
              this.getHolidayList();
              this.holidayDateInputElement.nativeElement.focus();
              Utils.alertSuccess({ text: 'ลบวันหยุดสำเร็จ' });
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          // ดำเนินการเมื่อผู้ใช้คลิกปุ่ม "Cancel"
          console.log('Cancelled');
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

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: this.events,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    height: 'auto',  // Ensures the calendar height adjusts automatically
    contentHeight: 'auto',  // Ensures the calendar's content area adjusts automatically
    aspectRatio: 1.5,  // Controls the width-to-height ratio, useful for responsiveness
    weekends: true,  // Example of other options that can be used
  };



  handleDateClick(arg: DateClickArg) {
    this.holidayForm.reset();
    const date = parseISO(arg.dateStr);
    const formattedDateStr = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    this.holidayForm.patchValue({ holidayDate: formattedDateStr, year: moment(arg.date).year() });
  }

  handleEventClick(clickInfo: { event: any }) {
    this.getHolidayDetail(clickInfo.event.extendedProps.id);
  }




}
