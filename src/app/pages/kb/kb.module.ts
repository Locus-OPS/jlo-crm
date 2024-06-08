import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { NewFolderComponent } from './component/tree/new-folder/new-folder.component';
import { TreeModalComponent } from './component/detail/tree-modal/tree-modal.component';
import { DetailComponent } from './component/detail/detail.component';
import { DetailInfoComponent } from './component/detail-info/detail-info.component';
import { KeywordComponent } from './component/keyword/keyword.component';
import { TreeComponent } from './component/tree/tree.component';
import { DocumentComponent } from './component/document/document.component';
import { MainDocumentComponent } from './component/main-document/main-document.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '../common/common.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  imports: [
    SharedModule,
    FontAwesomeModule,
    CommonModule
  ],
  declarations: [
    ContentComponent, DetailComponent, DetailInfoComponent,
    KeywordComponent, TreeComponent, DocumentComponent, MainDocumentComponent,
    TreeModalComponent, NewFolderComponent
  ],
  exports: [
    ContentComponent, DetailComponent, DetailInfoComponent,
    KeywordComponent, TreeComponent, DocumentComponent, MainDocumentComponent,
    TreeModalComponent, NewFolderComponent
  ],
})
export class KbModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(far, fas);
  }
}
