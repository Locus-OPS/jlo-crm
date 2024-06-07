import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { MenuModule } from './menu/menu.module';
import { PositionModule } from './position/position.module';
import { CodebookModule } from './codebook/codebook.module';
import { InternationalizationModule } from './internationalization/internationalization.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { BusinessUnitModule } from './business-unit/business-unit.module';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    MenuModule,
    PositionModule,
    CodebookModule,
    InternationalizationModule,
    RoleModule,
    UserModule,
    BusinessUnitModule
  ],
})
export class SystemModule { }
