import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Globals } from 'src/app/shared/globals';
import { AppStore } from 'src/app/shared/app.store';
import { id } from '@swimlane/ngx-charts';
import { ModalEmailComponent } from '../common/modal-email/modal-email.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-advertising',
    templateUrl: './advertising.component.html',
    styleUrl: './advertising.component.scss',
    imports: [SharedModule, CreatedByComponent]
})
export class AdvertisingComponent extends BaseComponent implements OnInit {

  createForm: FormGroup;
  titleModalEmail: string = "";

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,

    public router: Router,
    public globals: Globals,
    public dialog: MatDialog,
    private appStore: AppStore,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {
    super(router, globals);


    this.translate.get(['ads.email.title']).subscribe(translation => {
      this.titleModalEmail = translation['ads.email.title'];
    });

  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      id: [''],
      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: ['']
    });
  }


  openModalSendEmail(module: string) {
    const dialogRef = this.dialog.open(ModalEmailComponent, {
      height: '85%',
      width: '80%',
      disableClose: true,
      data: {
        titleModalEmail: this.titleModalEmail,
        parentModule: module
      }
    });

    // const dialogRef = this.dialog.open(ModalEmailComponent, {
    //   maxWidth: "50%",
    //   width: '1000px',
    //   height: '800px',
    //   disableClose: true,
    //   // data:data,
    //   data: {
    //   }
    // });

    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed');

    });



  }



}
