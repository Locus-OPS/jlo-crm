import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { UntypedFormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { TierData } from './tier-data';
import { TierService } from './tier.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgramData } from '../../program-data';
import { ProgramStore } from '../../program.store';
import { TierStore } from './tier.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-tier-tab',
  templateUrl: './tier-tab.component.html',
  styleUrls: ['./tier-tab.component.scss']
})
export class TierTabComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(this.programData.programId); });

  programSubscription: Subscription;
  programData: ProgramData;

  tierSubscription: Subscription;

  tierId: number;
  sortColumn: string;
  sortDirection: string;
  selectedRow: TierData;
  groupDataSource: TierData[];
  dataSource: TierData[];
  displayedColumns: string[] = ['tierLevel','tier', 'primary', 'activeFlag'];
  deleted = false;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private tierService: TierService,
    private programStore: ProgramStore,
    private tierStore: TierStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    this.programSubscription = this.programStore.getProgram().subscribe(program => {
      if (program) {
        this.programData = program;
        this.search(this.programData.programId);
        this.onSelectRow(null);
      }
    });
    this.tierSubscription = this.tierStore.getTier().subscribe(tier => {
      if (tier && tier.tierId === this.selectedRow.tierId) {
        Utils.assign(this.selectedRow, tier);
      } else {
        this.search(this.programData.programId);
        this.selectedRow = null;
      }
    });
  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }
  }

  ngOnDestroy() {
    this.programSubscription.unsubscribe();
    this.tierSubscription.unsubscribe();
  }

  search(programId: number) {
    this.tierService.getTierList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        programId: programId,
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later - from Tier Service.',
      });
    });
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.tierStore.updateTier(this.selectedRow);
  }

  onDelete(element: TierData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.tierService.deleteTier({
          data: {
            tierId: element.tierId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Tier', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search(this.programData.programId);
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

  create() {
    this.onSelectRow({});
  }
}

