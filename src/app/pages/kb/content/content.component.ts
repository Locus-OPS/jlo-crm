import { Component, OnInit } from '@angular/core';
import { KbStore } from '../kb.store';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TreeComponent } from '../component/tree/tree.component';
import { DetailComponent } from '../component/detail/detail.component';
import { DetailInfoComponent } from '../component/detail-info/detail-info.component';
import { MainDocumentComponent } from '../component/main-document/main-document.component';
import { KeywordComponent } from '../component/keyword/keyword.component';
import { DocumentComponent } from '../component/document/document.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  standalone: true,
  imports: [SharedModule, TreeComponent, DetailComponent, DetailInfoComponent, MainDocumentComponent, DocumentComponent, KeywordComponent]
})
export class ContentComponent extends BaseComponent implements OnInit {

  private activatedRoute: ActivatedRoute;

  constructor(
    private kbStore: KbStore,
    private route: ActivatedRoute,
    private tabParam: TabParam,
    public router: Router,
    public globals: Globals,
  ) {
    super(router, globals);
    this.activatedRoute = route;
  }

  ngOnInit() {
    const contentType = this.tabParam.params['contentType'];
    this.kbStore.loadKbContentType(contentType);
  }

}
