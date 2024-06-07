import { NgModule } from '@angular/core';
import { BulkloadpointComponent } from './bulkloadpoint.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/module/shared.module';

const BulkloadpointRoutes: Routes = [
  {
    path: '',
    component: BulkloadpointComponent
  }
];

@NgModule({
  declarations: [BulkloadpointComponent],
  imports: [
    RouterModule.forChild(BulkloadpointRoutes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class BulkloadpointModule { }
