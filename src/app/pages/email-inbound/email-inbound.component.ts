import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmailInboundService } from './email-inbound.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';

@Component({
  selector: 'app-email-inbound',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './email-inbound.component.html',
  styleUrl: './email-inbound.component.scss'
})
export class EmailInboundComponent extends BaseComponent implements OnInit {

  selectedRow: any;
  dataSource: any[];
  displayedColumns: string[] = ['id', 'formEmail', /*'toEmail',*/ 'subjectEmail', 'statusName', 'createdDate', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchForm: FormGroup;
  deptStatusList: Dropdown[];
  constructor(
    private formBuilder: FormBuilder,
    private emailIbService: EmailInboundService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public api: ApiService,
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['MAIL_IB_STATUS']
    }).then(
      result => {


      }
    );


  }


  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      formEmail: [''],
      subjectEmail: [''],
      startDate: [""],
      endDate: [""],
      plainContent: [""]
    });

    this.search();
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
    this.emailIbService.getEmailInboundList({
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


  onSelectRow(row: any) {
    this.selectedRow = row;
  }



  gotoEmailInboundDetailPage(emailIb: any) {
    this.router.navigate(["/email-inbound-detail", { id: emailIb.id }]);
  }
}
