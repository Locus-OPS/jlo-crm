import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ContentComponent } from './content.component';
import { KeywordComponent } from '../component/keyword/keyword.component';
import { TreeComponent } from '../component/tree/tree.component';
import { MainDocumentComponent } from '../component/main-document/main-document.component';
import { DocumentComponent } from '../component/document/document.component';
import { DetailComponent } from '../component/detail/detail.component';
import { DetailInfoComponent } from '../component/detail-info/detail-info.component';
import { CommonModule } from '../../common/common.module';

const ContentRoutes: Routes = [
  {
    path: '',
    component: ContentComponent
  }
];

@NgModule({
  declarations: [ContentComponent, DetailComponent, DetailInfoComponent, KeywordComponent, TreeComponent, DocumentComponent, MainDocumentComponent],
  imports: [
    RouterModule.forChild(ContentRoutes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class ContentModule { }
