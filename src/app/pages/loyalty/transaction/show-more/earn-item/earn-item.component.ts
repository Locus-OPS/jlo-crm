import { Component, OnInit, Input } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroup, FormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { EarnData } from './earn-data';
import { EarnItemService } from './earn-item.service';

@Component({
  selector: 'app-earn-item',
  templateUrl: './earn-item.component.html',
  styleUrls: ['./earn-item.component.scss']
})
export class EarnItemComponent implements OnInit {
  @Input()
  txnId: number;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: EarnData[];
  displayedColumns: string[] = ['earnId', 'promotionId', 'promotion', 'action',
  'rule', 'pointType', 'earnValue', 'expiryDate'];
  searchForm: FormGroup;

  constructor(
    private earnItemService: EarnItemService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.search();
  }

  search() {
    const param = {
        txnId: this.txnId
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.earnItemService.getEarnItemList({
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
