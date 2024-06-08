import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {

  constructor(
    private translate: TranslateService
  ) {
    super();

    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.translate.get([
      'paging.itemsPerPage',
      'paging.nextPage',
      'pageing.previousPage'
    ]).subscribe(translation => {
      this.itemsPerPageLabel = translation['paging.itemsPerPage'];
      this.nextPageLabel = translation['paging.nextPage'];
      this.previousPageLabel = translation['pageing.previousPage'];
      this.changes.next();
    });
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}
