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
import { TabManageService } from '../../admin/tab-manage.service';

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
    private tabManageService: TabManageService,
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

        if (ConsultingUtils.isConsulting()) {
          ConsultingUtils.removeConsultingData();
        }


        //1.Set data from server into Session Storage 
        this.constInfoModel = null;
        this.constInfoModel = result.data;
        ConsultingUtils.setConsultingData(this.constInfoModel);

        //2. SetValue into form
        this.setValueConsultingInfo(this.constInfoModel);

        //3.Open Consulting Dialog
        this.showConsultingDialog(result.data.id, "CONSULTING_START");

      }

    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });

    });

  }


  updateStopConsulting(param: ApiRequest<any>): Promise<ApiResponse<any>> {
    return this.api.call('/api/consulting/updateStopConsulting', param);
  }


  onStopConsulting() {
    this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());

    this.spinner.show("approve_process_spinner");
    const params = { data: { ...this.constInfoModel } };

    this.updateStopConsulting(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");

      if (result.status) {

        ConsultingUtils.removeConsultingData();
        this.setValueConsultingInfo(result.data);
        this.showConsultingDialog(result.data.id, "CONSULTING_STOP");
        this.constInfoModel = null;

        //  this.constInfoModel = JSON.parse(ConsultingUtils.getConsultingData());
        console.log(this.constInfoModel);





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
        //alert("afterclosed");
        // if (result.statusCd != "01") {

        //this.constInfoModel = null;
        //this.setValueConsultingInfo(this.constInfoModel);

        //this.consultingForm.reset();

        //  }
      }


    });
  }

  closeAll() {
    console.log("remove tab all");
    this.tabManageService.removeTabs();
    window.location.href = "/";
  }

}
