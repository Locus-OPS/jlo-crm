import { Component, OnInit, Input } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { BurnData } from './burn-data';
import { FormGroup, FormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { BurnItemService } from './burn-item.service';

@Component({
  selector: 'app-burn-item',
  templateUrl: './burn-item.component.html',
  styleUrls: ['./burn-item.component.scss']
})
export class BurnItemComponent implements OnInit {
  @Input() txnId: number;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: BurnData[];
  displayedColumns: string[] = ['burnId', 'earnId', 'burnValue', 'promotion',
  'rule', 'action'];
  searchForm: FormGroup;

  constructor(
    private burnItemService: BurnItemService,
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
    this.burnItemService.getBurnItemList({
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
