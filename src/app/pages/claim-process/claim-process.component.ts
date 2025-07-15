import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TableControl } from 'src/app/shared/table-control';
import { ClaimProcessService } from './claim-process.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { UserData } from './claim-process.model';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-claim-process',
  templateUrl: './claim-process.component.html',
  styleUrls: ['./claim-process.component.scss'],
  standalone: true,
  imports: [SharedModule, CreatedByComponent]
})
export class ClaimProcessComponent extends BaseComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });
  selectedRow: UserData;
  dataSource: UserData[];
  displayedColumns: string[] = ['itemName', 'quantity', 'unitCost', 'totalCost', 'discount', 'amount', 'genericName', 'strength', 'dosageNo', 'dosageUnit', 'unitName', 'itemCategory'];

  uploadForm: UntypedFormGroup;
  file: File;

  methodList: Dropdown[];

  selectedFiles: FileList;
  submitted = false;
  imageSrc: string;
  uploadProgress = 0;


  constructor(
    public api: ApiService,
    private claimService: ClaimProcessService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog
  ) {
    super(router, globals);
    this.tableControl.pageSize = 10;
    api.getMultipleCodebookByCodeType({
      data: ['PROMPT_METHOD']
    }).then(
      result => {
        this.methodList = result.data['PROMPT_METHOD'];
      }
    );
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      methodCode: ['', Validators.required],
      fileName: ['', Validators.required],
    });

    // this.onSearch();
    this.CHECK_FORM_PERMISSION(this.uploadForm);
  }

  onSearch() {
    this.submitted = true;
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.claimService.getDataExtractionList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;

      this.submitted = true;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  clearSort() {
    if (this.sort)
      this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  selectFile(event) {
    this.file = null;
    this.uploadForm.patchValue({
      fileName: null
    });
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.uploadForm.patchValue({
        fileName: this.file.name
      });
    }
  }

  onSelectRow(row) {
    this.submitted = true;
    this.selectedRow = row;
  }

  onSave() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      return;
    }

    /*this.claimService.saveUser({
      data: this.uploadForm.value
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.uploadForm.patchValue(result.data);
        this.uploadForm.patchValue({
          ...this.selectedRow
          , buId: this.selectedRow.buId.toString()
        });

        this.uploadForm.patchValue({
          password: ''
        });

        Utils.alertSuccess({
          title: 'Updated!',
          text: 'User has been updated.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    });*/
  }

  clear() {
    this.uploadForm.reset();
    this.file = null;
    this.selectedFiles = null;
    this.fileUpload.nativeElement.value = '';
    this.uploadForm.patchValue({
      fileName: ''
    });
    this.clearSort();
  }

  async upload() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      return;
    }
    this.tableControl.resetPage();

    this.uploadProgress = 0;
    await this.claimService.geminiAnalyze(this.selectedFiles.item(0), this.uploadForm.controls['methodCode'].value).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          if (event.status === 200) {
            Utils.alertSuccess({
              title: 'Uploaded!',
              text: 'The file has been uploaded and analyzed successfully.',
            });

            this.onSearch();
          } else {
            Utils.alertError({
              text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            });
          }
          this.uploadProgress = 0;
        }
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาด:', err);
      },
      complete: () => {
        this.uploadForm.reset();
        this.selectedFiles = null;
        this.fileUpload.nativeElement.value = '';
      }
    });
  }
}
