import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ModalConsultingComponent } from 'src/app/pages/common/modal-consulting/modal-consulting.component';
import { ConsultingModel } from 'src/app/pages/consulting/consulting.model';
import { ApiService } from 'src/app/services/api.service';
import ConsultingUtils from 'src/app/shared/consultingStore';
import Utils from 'src/app/shared/utils';
import { ConsultingInfoComponent } from './consulting-info.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultingInfoService {

  private consultingInfoSubject = new BehaviorSubject<ConsultingModel>(null);
  constInfoModel: ConsultingModel;

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
  ) { }


  startWalkinConsulting(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/consulting/startWalkinConsulting', param);
  }

  startPhoneConsulting(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/consulting/startPhoneConsulting', param);
  }



  onStartPhoneConsulting(customerId: string) {

    this.spinner.show("approve_process_spinner");
    const params = { data: { 'customerId': customerId } };

    console.log(params);
    this.startPhoneConsulting(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");

      if (result.status) {
        ConsultingUtils.setConsultingData(result.data);
        this.showConsultingDialog(result.data.id, "CONSULTING_START");

        this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());
        console.log(this.constInfoModel);
        this.setValueConsultingInfo(this.constInfoModel);
      }

    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });

    });

  }


  stopPhoneConsulting(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/consulting/stopPhoneConsulting', param);
  }


  onStopPhoneConsulting(channelCd: string) {


    this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());

    this.spinner.show("approve_process_spinner");

    // const params   = {data:{...this.constInfoModel}} 
    const params = { data: { ...this.constInfoModel } }

    this.stopPhoneConsulting(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");

      if (result.status) {
        //ConsultingUtils.setConsultingData(result.data);
        ConsultingUtils.removeConsultingData();

        this.showConsultingDialog(result.data.id, "CONSULTING_STOP");

        this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());
        console.log(this.constInfoModel);
        this.setValueConsultingInfo(this.constInfoModel);
      }

    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });

    });

  }



  setValueConsultingInfo(constInfoModel: ConsultingModel) {
    this.consultingInfoSubject.next(constInfoModel);
  }

  getValueConsultingInfo(): Observable<ConsultingModel> {
    return this.consultingInfoSubject.asObservable();
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
        // if (result.statusCd != "01") {

        this.constInfoModel = null;
        this.setValueConsultingInfo(this.constInfoModel);

        //this.consultingForm.reset();

        //  }
      }


    });
  }


}
