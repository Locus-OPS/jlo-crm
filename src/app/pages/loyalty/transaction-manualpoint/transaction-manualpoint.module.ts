import { SharedModule } from 'src/app/shared/module/shared.module';
import { NgModule } from '@angular/core';
import { TransactionManualPointComponent } from './transaction-manualpoint.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: [
    TransactionManualPointComponent
  ],
  exports: [
    TransactionManualPointComponent
  ]
})
export class TransactionManualPointModule { }
