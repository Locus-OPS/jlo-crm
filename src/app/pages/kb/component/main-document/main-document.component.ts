import { Component, OnInit, OnDestroy } from '@angular/core';
import { KbService } from '../../kb.service';
import { KbStore } from '../../kb.store';
import { Subscription } from 'rxjs';
import { KbDocument } from '../../kb.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
    selector: 'kb-main-document',
    templateUrl: './main-document.component.html',
    styleUrls: ['./main-document.component.scss'],
    imports: [SharedModule]
})
export class MainDocumentComponent extends BaseComponent implements OnInit, OnDestroy {

  mainDocSubscription: Subscription;
  mainDoc: KbDocument;

  constructor(
    private kbService: KbService,
    private kbStore: KbStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    this.mainDocSubscription = this.kbStore.observeMainDocumentSubject().subscribe(data => {
      this.mainDoc = data;
    });
  }
  ngOnDestroy(): void {
    this.mainDocSubscription.unsubscribe();
  }

  ngOnInit() {

  }

  getDocPath(filePath: string, fileName: string) {
    return this.kbService.getKbDocPath(filePath, fileName);
  }

  isPdf(fileExtension: string) {
    return fileExtension && fileExtension.toLowerCase() === '.pdf';
  }

  isImg(fileExtension: string) {
    return fileExtension && ['.png', '.jpg', '.jpeg', '.gif'].find(ext => ext === fileExtension.toLowerCase());
  }

}
