import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdModule } from '../../md/md.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    MdModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule,
    PdfViewerModule,
    RouterModule
  ]
})
export class SharedModule { }
