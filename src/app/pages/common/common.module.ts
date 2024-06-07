import { NgModule } from '@angular/core';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { ModalMemberComponent } from './modal-member/modal-member.component';
import { ModalContentFileComponent } from './modal-file/modal-file.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ModalShopComponent } from './modal-shop/modal-shop.component';
import { ModalProductComponent } from './modal-product/modal-product.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalCustomerComponent } from './modal-customer/modal-customer.component';
import { CreatedByComponent } from './created-by/created-by.component';

@NgModule({
  declarations: [
    ModalUserComponent
    , ModalMemberComponent
    , ModalContentFileComponent
    , ModalShopComponent
    , ModalProductComponent
    , ModalConfirmComponent
    , ModalCustomerComponent
    , CreatedByComponent
  ],
  exports: [
    ModalUserComponent
    , ModalMemberComponent
    , ModalContentFileComponent
    , ModalShopComponent
    , ModalProductComponent
    , ModalConfirmComponent
    , ModalCustomerComponent
    , CreatedByComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CommonModule { }
