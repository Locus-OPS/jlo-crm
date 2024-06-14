import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultingInfoComponent } from './consulting-info.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/module/shared.module';


@NgModule({
  declarations: [ConsultingInfoComponent],
  exports: [ConsultingInfoComponent],
  imports: [RouterModule, CommonModule, MatButtonModule, TranslateModule, SharedModule]
})
export class ConsultingInfoModule { }
