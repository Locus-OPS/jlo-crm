import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder } from '@angular/forms';
import { EmailInboundService } from '../email-inbound.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-email-inbound-detail',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './email-inbound-detail.component.html',
  styleUrl: './email-inbound-detail.component.scss'
})
export class EmailInboundDetailComponent extends BaseComponent implements OnInit {

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
      data: ['ACTIVE_FLAG']
    }).then(
      result => {


      }
    );


  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
