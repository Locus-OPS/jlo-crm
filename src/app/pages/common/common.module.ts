import { NgModule } from '@angular/core';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { ModalMemberComponent } from './modal-member/modal-member.component';
import { ModalContentFileComponent } from './modal-file/modal-file.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalCustomerComponent } from './modal-customer/modal-customer.component';
import { CreatedByComponent } from './created-by/created-by.component';
import { ModalConsultingComponent } from './modal-consulting/modal-consulting.component';

@NgModule({
  declarations: [
    ModalUserComponent
    , ModalMemberComponent
    , ModalContentFileComponent
    , ModalConfirmComponent
    , ModalCustomerComponent
    , CreatedByComponent
    , ModalConsultingComponent
  ],
  exports: [
    ModalUserComponent
    , ModalMemberComponent
    , ModalContentFileComponent
    , ModalConfirmComponent
    , ModalCustomerComponent
    , CreatedByComponent
    , ModalConsultingComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CommonModule { }
