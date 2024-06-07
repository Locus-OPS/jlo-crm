import { NgModule } from '@angular/core';
import { InternationalizationComponent } from './internationalization.component';
import { SharedModule } from 'src/app/shared/module/shared.module';

@NgModule({
  declarations: [
    InternationalizationComponent
  ],
  exports: [
    InternationalizationComponent
  ],
  imports: [
    SharedModule
  ]
})
export class InternationalizationModule { }
