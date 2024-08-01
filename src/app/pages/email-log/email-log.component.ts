import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { EmailModel } from './email-log.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Globals } from 'src/app/shared/globals';
import { EmailLogService } from './email-log.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-email-log',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './email-log.component.html',
  styleUrl: './email-log.component.scss'
})
export class EmailLogComponent extends BaseComponent implements OnInit {


  all = "";
  searchForm: FormGroup;
  doctypeLegalList: Dropdown[];
  statusList: Dropdown[];


  selectedRow: EmailModel;
  dataSource: EmailModel[];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  displayedColumns: string[] = ['toEmail', 'ccEmail', 'subjectEmail', 'statusDesc', 'createdByName', 'createdDate', 'action'];

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog,
    private emailLogService: EmailLogService,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType(
      { data: ['EMAIL_LOG_STATUS'] }
    ).then(result => {
      this.statusList = result.data['EMAIL_LOG_STATUS'];
    });

  }

  ngOnInit() {
    console.log("ngOnInit");
    this.searchForm = this.formBuilder.group({
      statusCode: ['']
    });

    this.search();
  }

  onSelectRow(row) {
    this.selectedRow = row;
    //this.sendEmailForm.patchValue(row);

  }

  onSearch() {

    this.tableControl.resetPage();
    this.search();

  }

  search() {

    this.selectedRow = null;


    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };

    this.emailLogService.getEmailLogList({
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

  onResendEmail(row) {
    this.onSelectRow(row);

    console.log(row);

    var title = "Confirmation Message";
    var content = "Are you sure you want to resend email ?";
    var btnText = "Yes";

    Utils.confirm(title, content, btnText).then(confirm => {
      if (confirm.value) {
        this.sendEmail();
      }
    });
  }

  sendEmail() {

    const param = {
      id: this.selectedRow.id
    };

    this.emailLogService.sendEmailWithAtt({
      data: param
    }).then(result => {

      if (result.status) {
        // Utils.assign(this.selectedRow, result.data);

        const msgTitle = 'Send Email!';
        const msgText = 'Send has been Success.';

        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      } else {
        Utils.alertError({
          text: 'Send failed, please try again later.',
        });
      }
      this.search();

    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });



  }

}
