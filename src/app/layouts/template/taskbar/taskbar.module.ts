import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TaskbarComponent } from './taskbar.component';
import { SoftphoneComponent } from './softphone/softphone.component';
import { SharedModule } from 'src/app/shared/module/shared.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [TaskbarComponent, SoftphoneComponent],
  exports: [TaskbarComponent, SoftphoneComponent]
})

export class TaskbarModule { }
