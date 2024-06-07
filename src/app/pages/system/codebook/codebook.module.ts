import { NgModule } from '@angular/core';
import { CodebookComponent } from './codebook.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    CodebookComponent
  ],
  exports: [
    CodebookComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class CodebookModule { }
