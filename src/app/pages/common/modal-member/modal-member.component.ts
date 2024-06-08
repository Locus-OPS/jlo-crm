import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ModalMemberModel } from '../../common/modal-member/modal-member.model';
import { TableControl } from 'src/app/shared/table-control';
import { MatSort } from '@angular/material/sort';
import { MemberPopupService} from '../../common/modal-member/member.popup.service';
import Utils from 'src/app/shared/utils';
import { BaseComponent } from 'src/app/shared/base.component';

@Component({
  selector: 'app-modal-member',
  templateUrl: './modal-member.component.html',
  styleUrls: ['./modal-member.component.scss']
})
export class ModalMemberComponent extends BaseComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });
  selectedRow: ModalMemberModel;
  dataSource: ModalMemberModel[];
  displayedColumns: string[] = ['memberId', 'memberName', 'memberType', 'cardNumber', 'memberMobile'];

  searchForm: UntypedFormGroup;

  constructor(
      @Inject(MAT_DIALOG_DATA) public memberInfo: any,
      private dialogRef: MatDialogRef<ModalMemberComponent>,
      public api: ApiService,
      private memberPopupService: MemberPopupService,
      private formBuilder: UntypedFormBuilder,
      public router: Router,
      public globals: Globals) {
        super(router, globals);
      }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      cardNumber: [''],
      memberFirstName: [''],
      memberLastName: [''],
      memberMobile: ['']
    });

    this.tableControl.sortColumn = 'memberName';
    this.tableControl.sortDirection = 'asc';
    this.search();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  clear() {
    this.searchForm.reset();
    //this.clearSort();
    this.selectedRow = null;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search(){
    this.selectedRow = null;
    this.memberPopupService.getMemberPopupList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        ...this.searchForm.value
        , sortColumn: this.tableControl.sortColumn
        , sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSelectRow(row) {
    this.memberInfo = row;
    this.selectedRow = row;
  }

}
