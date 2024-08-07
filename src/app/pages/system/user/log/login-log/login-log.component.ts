import { Component, OnInit, Input } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { UserService } from '../../user.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/module/shared.module';

interface LoginLogData {
  userId?: string;
  attemptDate?: string;
  type?: string;
  ipAddress?: string;
  statusCode?: string;
  statusMessage?: string;
}

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class LoginLogComponent implements OnInit {

  @Input()
  userId: string;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: LoginLogData[];
  displayedColumns: string[] = ['userId', 'attemptDate', 'type', 'ipAddress', 'statusCode', 'statusMessage'];

  searchForm: UntypedFormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      attemptDateFrom: [''],
      attemptDateTo: [''],
      statusCode: [''],
      statusMessage: ['']
    });
    this.search();
  }

  search() {
    const param = {
      ...this.searchForm.value
      , userId: this.userId
      , attemptDateFrom: Utils.getDateString(this.searchForm.value['attemptDateFrom'])
      , attemptDateTo: Utils.getDateString(this.searchForm.value['attemptDateTo'])
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.userService.getUserLoginLogList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onAttemptDateFromChange(e) {
    if (this.searchForm.controls['attemptDateTo'].value < e.value) {
      this.searchForm.patchValue({
        attemptDateTo: e.value
      });
    }
  }

  onAttemptDateToChange(e) {
    if (this.searchForm.controls['attemptDateFrom'].value > e.value) {
      this.searchForm.patchValue({
        attemptDateFrom: e.value
      });
    }
  }

}
