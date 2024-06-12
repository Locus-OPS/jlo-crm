import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SoftphoneComponent } from './softphone.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [SoftphoneComponent],
  exports: [SoftphoneComponent]
})

export class SoftphoneModule { }
