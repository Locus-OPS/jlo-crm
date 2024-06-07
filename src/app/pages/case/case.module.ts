import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CaseComponent } from './case.component';
import { CasedetailsComponent } from './casedetails/casedetails.component';
import { CaseactivityComponent } from './caseactivity/caseactivity.component';
import { CaseattComponent } from './caseatt/caseatt.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../common/common.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CommonModule
  ],
  declarations: [
    CaseComponent, CasedetailsComponent, CaseactivityComponent, CaseattComponent
  ],
  exports: [
    CaseComponent, CasedetailsComponent, CaseactivityComponent, CaseattComponent
  ],
})
export class CaseModule { }
