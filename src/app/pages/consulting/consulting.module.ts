import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { RouterModule } from '@angular/router';
import { ConsultingComponent } from './consulting.component';



@NgModule({
  declarations: [ConsultingComponent],
  imports: [ 
    SharedModule,
    RouterModule,
    CommonModule
  ],exports: [ConsultingComponent]
})
export class ConsultingModule { }

 