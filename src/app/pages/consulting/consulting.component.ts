import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ModalUserComponent } from '../common/modal-user/modal-user.component';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';

@Component({
  selector: 'app-consulting',
  standalone: false,
  //imports: [],
  templateUrl: './consulting.component.html',
  styleUrl: './consulting.component.scss'
})
export class ConsultingComponent  extends BaseComponent implements OnInit {
  
  searchForm: FormGroup;

  displayedColumns: string[] = ["consultingNumber","channelName","customerName","title","statusName","startDate","endDate","ownerName","action"];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: any[];


  channelList: Dropdown[];


  constructor(
    public api: ApiService,     
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
  ) {
    super(router, globals);
     
    api.getMultipleCodebookByCodeType(
      { data: ['CONSULTING_CHANNEL'] }
    ).then(result => {
      this.channelList = result.data['CONSULTING_CHANNEL'];
      
    });
  }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
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
      custId:[""],
      custName:[""]
    });

    //CONSULTING_CHANNEL
  }

  onSearch() {

  }
  search(){

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

  onConsultingCreate(){

  }
}
