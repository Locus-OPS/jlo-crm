import { Component, OnInit, Input } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { PromotionAttrData } from './promotion-attr-data';
import { FormGroup, FormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { PromotionAttrService } from './promotion-attr.service';

@Component({
  selector: 'app-promotion-attr',
  templateUrl: './promotion-attr.component.html',
  styleUrls: ['./promotion-attr.component.scss']
})
export class PromotionAttrComponent implements OnInit {
  @Input() txnId: number;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: PromotionAttrData[];
  displayedColumns: string[] = ['promotionId',
  'promotion', 'processedDate', 'attrName', 'attrValue'];
  searchForm: FormGroup;

  constructor(
    private promotionAttrService: PromotionAttrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.search();
    console.log('txnId++++++++++++++++++++', this.txnId);
  }

  search() {
    const param = {
        txnId: this.txnId
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.promotionAttrService.getPromotionAttrList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

}
