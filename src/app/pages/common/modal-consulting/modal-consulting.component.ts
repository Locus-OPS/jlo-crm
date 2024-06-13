import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { CustomerModalService } from '../modal-customer/customer-modal-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ModalCustomerComponent } from '../modal-customer/modal-customer.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalUserComponent } from '../modal-user/modal-user.component';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ConsultingService } from './consulting.service';

import Utils from 'src/app/shared/utils';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-consulting',
  templateUrl: './modal-consulting.component.html',
  styleUrl: './modal-consulting.component.scss'
})
export class ModalConsultingComponent extends BaseComponent implements OnInit {
  
  createForm: FormGroup;
  channelList: Dropdown[];
  statusList: Dropdown[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public consultingInfo: any,
    private dialogRef: MatDialogRef<ModalConsultingComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private customerModalService: CustomerModalService,
    private el: ElementRef,
    public router: Router,
    public dialog: MatDialog,
    private consulting : ConsultingService,
    private spinner: NgxSpinnerService,
    public globals: Globals) {
    super(router, globals);
    api.getMultipleCodebookByCodeType(
      { data: ['CONSULTING_CHANNEL','CONSULTING_STATUS'] }
    ).then(result => {
      this.channelList = result.data['CONSULTING_CHANNEL'];
      this.statusList == result.data['CONSULTING_STATUS'];
      
    });
    }
    ngOnInit() {
      this.createForm = this.formBuilder.group({
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
        custNameDisplay:[""],
        createdBy: [''],
        createdDate: [''],
        updatedBy: [''],
        updatedDate: ['']

      });

      this.getConsultingData();

    }

    getConsultingData(){

      console.log(this.consultingInfo.id);
      let id =  this.consultingInfo.id;
      const params = {data:{id:id}}

      
      this.consulting.getConsultingData(params).then((result: any) => {
        this.spinner.hide("approve_process_spinner");
        if (result.status) {
          this.createForm.reset();
          let data = result.data;
          this.createForm.patchValue(data);

        }else{

        }
      },(err: any) => {
        Utils.alertError({
          text: err.message,
        });
      });



    }

    onNoClick() {
      this.dialogRef.close();
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
        this.createForm.patchValue({ ownerId: result.id, ownerDisplay: result.displayName });
      }
    });
  }

  removeOwner() {
    this.createForm.patchValue({ ownerId: '', ownerDisplay: '' });
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
        this.createForm.patchValue({ customerId: result.customerId, custNameDisplay:custNameDisplay});
      }
    });
  }

  removeCustomer() {
    this.createForm.patchValue({ customerId: '', custNameDisplay: '' });
  }
  

onSaveConsulting(){ 
  let data = this.createForm.getRawValue();

  this.consulting.updateConsulting({ data }).then((result: any) => {      
      this.spinner.hide("approve_process_spinner");             
        if (result.status) {         




        }else{
          setTimeout(() => {
            this.spinner.hide("approve_process_spinner");
          }, 1000);


          if(result.message!=""){
            Utils.alertError({
              text: result.message,
            });
          }else{
            Utils.alertError({
              text: "Please try again later.",
            });
          }
        }
      },(err: any) => {
        Utils.alertError({
          text: err.message,
        });
      }

    );
     
  }

}


 




  

 
