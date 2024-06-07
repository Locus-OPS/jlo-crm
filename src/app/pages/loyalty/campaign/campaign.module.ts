import { NgModule } from '@angular/core';
import { CampaignComponent } from './campaign.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    CampaignComponent
  ],
  exports: [
    CampaignComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class CampaignModule { }
