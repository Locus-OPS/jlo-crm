import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ModalUserComponent } from '../common/modal-user/modal-user.component';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { ModalCustomerComponent } from '../common/modal-customer/modal-customer.component';
import { ConsultingService } from './consulting.service';
import Utils from 'src/app/shared/utils';
import { ModalConsultingComponent } from '../common/modal-consulting/modal-consulting.component';

@Component({
  selector: 'app-consulting',
  standalone: false, 
  templateUrl: './consulting.component.html',
  styleUrl: './consulting.component.scss'
})
export class ConsultingComponent  extends BaseComponent implements OnInit {
  
  searchForm: FormGroup;


  displayedColumns: string[] = ["consultingNumber","channelName","customerName","title","statusName","startDate","endDate","ownerName","action"];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: any[];

  searchFormSr: FormGroup;
  selectedRow: any[];
  dataSourceSr: any[];
  displayedColumnsSr: string[] = ['caseNumber', 'typeName', 'fullName', 'subTypeName', 'priorityName', 'action'];

  channelList: Dropdown[];
  statusList: Dropdown[];

  constructor(   
    public api: ApiService,     
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
    private consulting : ConsultingService,
  ) {
    super(router, globals);
     
    api.getMultipleCodebookByCodeType(
      { data: ['CONSULTING_CHANNEL','CONSULTING_STATUS'] }
    ).then(result => {
      this.channelList = result.data['CONSULTING_CHANNEL'];
      this.statusList == result.data['CONSULTING_STATUS'];
      
    });
  }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      id: [""], 
      consultingNumber: [""], 
      channelCd: [""],
      statusCd: [""],
      startDate: [""],
      endDate: [""],
      title: [""],
      callingNumber: [""],
      callObjectId: [""],
      ownerDisplay:[""],
      ownerId: [""],
      note: [""],
      consultingTypeCd: [""],
      contactId: [""],
      agentState: [""],
      reasonCode: [""],
      consultingAction: [""],
      customerId:[""],
      custNameDisplay:[""]
    });
    this.searchFormSr = this.formBuilder.group({       
      consultingNumber: [""],       
    });
    

    this.onSearch();

  }

  onSearch() {

    this.tableControl.resetPage();
    this.search();
    
  }

   search() {
    const param = {
      ...this.searchForm.getRawValue(),
      sortColumn: this.tableControl.sortColumn,
      sortDirection: this.tableControl.sortDirection,
    };

    this.consulting.getConsultingDataList({
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
  clear() {
    this.searchForm.reset();
    this.onSearch();
  }

  showOwner() {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchForm.patchValue({ ownerId: result.id, ownerDisplay: result.displayName });
      }
    });
  }

  removeOwner() {
    this.searchForm.patchValue({ ownerId: '', ownerDisplay: '' });
  }


  searchCustomer() {
    const dialogRef = this.dialog.open(ModalCustomerComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let custNameDisplay = result.firstName +' '+result.lastName;
        this.searchForm.patchValue({ customerId: result.customerId, custNameDisplay:custNameDisplay});
      }
    });
  }

  removeCustomer() {
    this.searchForm.patchValue({ customerId: '', custNameDisplay: '' });
  }

  onConsultingCreate(){

  }

  onConsultingEdit(element){
    this.showConsultingDialog(element.id);
  }

  showConsultingDialog(id:string) {
    const dialogRef = this.dialog.open(ModalConsultingComponent, {
      height: '85%',
      width: '80%',
     // panelClass: 'my-dialog',
      data: {id:id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  onSelectRow(row) {
    this.selectedRow = row;
     
  }

}
