import { Component, OnInit } from '@angular/core';
import { KbStore } from '../kb.store';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
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
