import { NgModule } from '@angular/core';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { ModalMemberComponent } from './modal-member/modal-member.component';
import { ModalContentFileComponent } from './modal-file/modal-file.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalCustomerComponent } from './modal-customer/modal-customer.component';
import { ModalConsultingComponent } from './modal-consulting/modal-consulting.component';
import { CreatedByComponent } from './created-by/created-by.component';

@NgModule({
  exports: [
    ModalUserComponent
    , ModalMemberComponent
    , ModalContentFileComponent
    , ModalConfirmComponent
    , ModalCustomerComponent
    , ModalConsultingComponent
    , CreatedByComponent
  ],
  imports: [
    SharedModule,
    CreatedByComponent,
    ModalConfirmComponent,
    ModalUserComponent,
    ModalMemberComponent,
    ModalContentFileComponent,
    ModalCustomerComponent,
    ModalConsultingComponent
  ]
})
export class CommonModule { }
