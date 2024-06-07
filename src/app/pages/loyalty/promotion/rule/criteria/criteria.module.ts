import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriteriaComponent } from './criteria.component';
import { ShowMoreComponent } from './show-more/show-more.component';
import { BuilderComponent } from './show-more/builder/builder.component';
import { SharedModule } from 'src/app/shared/module/shared.module';



@NgModule({
  declarations: [CriteriaComponent, ShowMoreComponent, BuilderComponent],
  entryComponents: [ShowMoreComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[CriteriaComponent]
})
export class CriteriaModule { }
