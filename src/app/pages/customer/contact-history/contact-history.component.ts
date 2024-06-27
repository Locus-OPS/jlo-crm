import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';

import { TabManageService, TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TableControl } from 'src/app/shared/table-control';
import { ConsultingService } from 'src/app/pages/consulting/consulting.service';
import Utils from 'src/app/shared/utils';
import { ModalConsultingComponent } from '../../common/modal-consulting/modal-consulting.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-history',
  templateUrl: './contact-history.component.html',
  styleUrl: './contact-history.component.scss'
})
export class ContactHistoryComponent extends BaseComponent implements OnInit {
  searchForm: FormGroup;

  @Input() customerIdParam: any;

  displayedColumns: string[] = ["consultingNumber", "channelCd", "title"
    , "statusName"
    , "startDate"
    , "endDate"
    , "consOwnerName"
    , "action"];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: any[];


  constructor(
    private tabManageService: TabManageService,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private consulting: ConsultingService,
    public router: Router,
    public globals: Globals,
    public tabParam: TabParam,
    private dialog: MatDialog,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
  ) {
    super(router, globals);
    /*https://github.com/seanyeh/fontawesome-svgs */
    /**
 01 Voice
02 Email
03 Web Chat
04 Walk in
05 Line
06 Facebook
-->
     */
    iconRegistry.addSvgIcon('voice-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/phone-square-light.svg'));
    iconRegistry.addSvgIcon('email-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/email.svg'));
    iconRegistry.addSvgIcon('webchat-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/chat.svg'));
    iconRegistry.addSvgIcon('walkin-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/walking-light.svg'));
    iconRegistry.addSvgIcon('line-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/line-brands.svg'));
    iconRegistry.addSvgIcon('fb-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/facebook-brands.svg'));




  }
  ngOnInit(): void {

    this.searchForm = this.formBuilder.group({
      customerId: [this.customerIdParam]
    });
    //alert("Init custID" + this.customerIdParam);

    this.onSearch();
  }

  onSearch() {

    this.tableControl.resetPage();
    this.search();

  }

  search() {
    //alert("custId : " + this.customerIdParam)
    const param = {
      ...this.searchForm.getRawValue(),
      sortColumn: this.tableControl.sortColumn,
      sortDirection: this.tableControl.sortDirection,
    };

    this.consulting.getConsultingDataListByCustomerId({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param,
    })
      .then(
        (result) => {
          this.dataSource = result.data;
          this.tableControl.total = result.total;
        },
        (error) => {
          Utils.alertError({
            text: error.message,
          });
        }
      );
  }


  onConsultingEdit(element) {
    this.showConsultingDialog(element.id);
  }

  showConsultingDialog(id: string) {
    const dialogRef = this.dialog.open(ModalConsultingComponent, {
      height: '85%',
      width: '80%',
      // panelClass: 'my-dialog',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}  
