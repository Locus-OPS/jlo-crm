import { NgModule } from '@angular/core';
import { PartnerComponent } from './partner.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { PartnerTypeComponent } from './partner-type/partner-type.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    PartnerComponent,
    PartnerTypeComponent
  ],
  exports: [
    PartnerComponent,
    PartnerTypeComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class PartnerModule { }
