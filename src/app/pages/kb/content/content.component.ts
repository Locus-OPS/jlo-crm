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
import { RatingComponent } from "../component/rating/rating.component";
import { FavoriteComponent } from '../component/favorite/favorite.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FavtreeComponent } from '../component/favtree/favtree.component';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    imports: [SharedModule, TreeComponent, FavtreeComponent, DetailComponent, DetailInfoComponent, MainDocumentComponent, DocumentComponent, KeywordComponent, RatingComponent, FavoriteComponent, MatTabsModule]
})
export class ContentComponent extends BaseComponent implements OnInit {

  private activatedRoute: ActivatedRoute;
  likedContent: { contentId: number, liked: boolean } | null = null;

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
