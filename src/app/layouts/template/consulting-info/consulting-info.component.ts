import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalConsultingComponent } from 'src/app/pages/common/modal-consulting/modal-consulting.component';
import { ConsultingService } from 'src/app/pages/consulting/consulting.service';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import ConsultingUtils from 'src/app/shared/consultingStore';
import { Globals } from 'src/app/shared/globals';
import Utils from 'src/app/shared/utils';
import { ConsultingInfoService } from './consulting-info.service';
import { ConsultingModel } from 'src/app/pages/consulting/consulting.model';
import { ModalConsultingService } from 'src/app/pages/common/modal-consulting/modal-consulting.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-consulting-info',
  standalone: false,
  templateUrl: './consulting-info.component.html',
  styleUrl: './consulting-info.component.scss'
})
export class ConsultingInfoComponent extends BaseComponent implements OnInit {
  consultingForm: FormGroup;


  currentWalkInStatusCode = 'STOP';
  currentWalkInStatusName = '';

  constInfoModel: ConsultingModel;

  private consultingInfoSubject = new BehaviorSubject<ConsultingModel>(null);

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    private modalConsulting: ModalConsultingService,
    private consultingInfoService: ConsultingInfoService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,

    public globals: Globals) {
    super(router, globals);

  }

  ngOnInit() {

    this.consultingForm = this.formBuilder.group({
      consultingNumber: new FormControl({ value: "", disabled: true }),
      status: new FormControl({ value: "", disabled: true }),
      client: new FormControl({ value: "", disabled: true }),
      channel: new FormControl({ value: "", disabled: true }),
      contact: new FormControl({ value: "", disabled: true }),

    });



    this.onInitConsultInfo();


    this.consultingInfoService.getValueConsultingInfo().subscribe(constInfoModel => {
      if (constInfoModel != null && constInfoModel != undefined) {
        console.log(constInfoModel);
        this.onInitConsultInfo();
        // this.setValueConsultingInfo(this.constInfoModel);

      }



    });


  }

  onInitConsultInfo() {
    if (ConsultingUtils.isConsulting()) {
      this.constInfoModel = this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());
      this.getConsultingInfoData();
    } else {
      this.constInfoModel = null;
      this.consultingForm.reset();
    }
  }

  getConsultingInfoData() {

    // console.log(this.consultingInfo.id);
    let id = this.constInfoModel.id;
    const params = { data: { id: id } };


    this.modalConsulting.getConsultingData(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");
      if (result.status) {
        if (ConsultingUtils.isConsulting()) {
          ConsultingUtils.setConsultingData(result.data);
        }

        this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());
        this.setValueConsultingInfo(this.constInfoModel);
      } else {

      }
    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });
    });

  }

  setValueConsultingInfo(constInfoModel: ConsultingModel) {
    this.consultingForm.patchValue({
      consultingNumber: this.constInfoModel.consultingNumber
      , status: this.constInfoModel.statusName
      , client: this.constInfoModel.customerName
      , channel: this.constInfoModel.channelName
      , contact: this.constInfoModel.contactName
    });

  }

  onStartWalkinConsulting(channelCd: string) {

    this.spinner.show("approve_process_spinner");
    const params = { data: { 'channelCd': channelCd } }
    this.consultingInfoService.startWalkinConsulting(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");

      if (result.status) {
        ConsultingUtils.setConsultingData(result.data);
        this.showConsultingDialog(result.data.id, "CONSULTING_START");

        this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());
        // console.log(result.data);
        console.log(this.constInfoModel);
        this.setValueConsultingInfo(this.constInfoModel);
      }

    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });
    }

    );

  }

  onStopWalkinConsulting() {
    this.consultingInfoService.onStopConsulting();
  }


  showConsultingDialog(id: string, action: string) {
    const dialogRef = this.dialog.open(ModalConsultingComponent, {
      height: '85%',
      width: '80%',
      disableClose: true,
      data: { id: id, action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.statusCd != "01") {
          this.constInfoModel = null;
          this.consultingForm.reset();
        }
      }


    });
  }
}
