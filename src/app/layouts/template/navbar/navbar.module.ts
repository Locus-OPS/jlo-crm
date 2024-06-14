import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/module/shared.module'; 
import { ConsultingInfoModule } from '../consulting-info/consulting-info.module';
@NgModule({
    declarations: [NavbarComponent],
    exports: [NavbarComponent],
    imports: [RouterModule, CommonModule, MatButtonModule, TranslateModule, SharedModule,ConsultingInfoModule]
})

export class NavbarModule {}
