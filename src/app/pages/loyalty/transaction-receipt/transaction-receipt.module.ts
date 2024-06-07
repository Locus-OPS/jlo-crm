import { TransactionReceiptComponent } from './transaction-receipt.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    TransactionReceiptComponent
  ],
  exports: [
    TransactionReceiptComponent
  ]
})
export class TransactionReceiptModule { }
