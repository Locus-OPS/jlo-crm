
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import { Caseatt } from './caseatt.model';
import { CaseattService } from './caseatt.service';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { ApiResponse } from 'src/app/model/api-response.model';
import { CasedetailsComponent } from '../casedetails/casedetails.component';
import { Subscription } from 'rxjs';
import { CaseStore } from '../case.store';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/shared/base.component';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalContentFileComponent } from 'src/app/pages/common/modal-file/modal-file.component';
import { CustomerService } from '../../customer/customer.service';

@Component({
  selector: 'tab-caseatt-content',
  templateUrl: './caseatt.component.html',
  styleUrls: ['./caseatt.component.scss']

})
export class CaseattComponent extends BaseComponent implements OnInit, OnDestroy {
  caseNumber: string;
  caseDetailcom: CasedetailsComponent;
  caseDetailSubscription: Subscription;

  attachtmentId: string;




  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  searchForm: UntypedFormGroup;
  attCreateForm: UntypedFormGroup;
  file: File;


  isUpdate = false;
  selectedRow: Caseatt;

  dataSource: Caseatt[];
  displayedColumns: string[] = ['caseAttId', 'fileName', 'createdBy', 'updatedBy', 'action'];

  tableControl: TableControl = new TableControl(() => { this.search(); });

  fileName: string;
  fileType: string;
  fileTempUrl: string;
  fileUrl: SafeResourceUrl;

  downloadfileUrl: SafeResourceUrl;


  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private caseacttService: CaseattService,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog,
    private caseStore: CaseStore,
    public sanitizer: DomSanitizer,

  ) {
    super(router, globals);


  }

  ngOnDestroy() {
    this.caseDetailSubscription.unsubscribe();
  }

  getAttachmentListAll() {

    // if (sessionStorage.getItem('caseNumber')) {

    //   this.caseNumber = sessionStorage.getItem('caseNumber');
    //   this.searchForm.patchValue({ caseNumber: this.caseNumber });
    //   this.search();
    // } else {
    //   this.searchForm.patchValue({ caseNumber: null });
    // }


    this.caseDetailSubscription = this.caseStore.getCaseDetail().subscribe(resultDetail => {
      if (resultDetail) {
        console.log(resultDetail);
        this.caseNumber = resultDetail.caseNumber;
        this.searchForm.patchValue({ caseNumber: resultDetail.caseNumber });
        this.search();

      } else {
        this.searchForm.reset();
        this.searchForm.patchValue({ caseNumber: null });
        this.search();
      }
    });
  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      caseNumber: [this.caseNumber],
    });



    this.attCreateForm = this.formBuilder.group({
      caseAttId: [''],
      caseNumber: ['', Validators.required],
      attachmentId: [''],
      fileName: [''],
      filePath: [''],
      fileExtension: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      fullPath: ['']
    });

    this.CHECK_FORM_PERMISSION(this.attCreateForm);
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['caseAttId', 'fileName', 'createdDate', 'createdBy', 'updatedBy', 'action'];
    } else {
      this.displayedColumns = ['caseAttId', 'fileName', 'createdDate', 'createdBy', 'updatedBy']
    }

    this.getAttachmentListAll();
  }


  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };

    this.caseacttService.getCaseAttachmentListByCaseNumber({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, () => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onAttCreate() {

    this.isUpdate = false;
    this.selectedRow = {};
    this.attCreateForm.reset();
    this.downloadfileUrl = null;
    this.fileUrl = null;

    this.attCreateForm.patchValue({ caseNumber: this.caseNumber });


  }

  onActDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.caseacttService.deleteCaseAttachment({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Attachment has been deleted.',
            });
            this.search();

          } else {
            Utils.alertError({
              text: 'Attachment has not been deleted.',
            });
          }
        });
      }
    });
  }

  onSelectRow(row: Caseatt) {
    this.isUpdate = true;
    this.selectedRow = row;
    this.attCreateForm.patchValue({
      ...this.selectedRow
    });
    this.fileName = this.attCreateForm.controls['fileName'].value;
    this.getAttachDisplay(this.attCreateForm.controls['attachmentId'].value);
  }

  getAttachDisplay(attId: number) {
    this.api.getAttachmentByAttId(attId).subscribe(res => {

      var resFileURL = URL.createObjectURL(res);
      console.log(res.type);
      this.fileType = res.type;
      console.log(resFileURL);
      if (this.isFileCanDisplay(this.fileType)) {

        this.fileTempUrl = resFileURL;
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileTempUrl);

      } else {

        this.fileUrl = null;
        this.downloadfileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(res));

      }

    });
  }

  isFileCanDisplay(file: string) {
    if (this.isFileViews(file)) {
      return true;
    } else {
      return false;
    }

  }

  isFileViews(type: string) {
    const acceptedTypes = ['image/gif', 'image/jpeg', 'image/png', 'application/pdf', 'text/plain', 'audio/x-wav'];

    return acceptedTypes.includes(type)
  }



  selectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.attCreateForm.patchValue({
        fileName: this.file.name
      });
    }
  }

  onAttSave() {

    if (this.attCreateForm.invalid) {
      // alert(" invalid : " + this.caseNumber);
      return;
    }

    const caseatt: Caseatt = {
      caseAttId: this.attCreateForm.controls['caseAttId'].value
      , attachmentId: this.attCreateForm.controls['attachmentId'].value
      , caseNumber: this.caseNumber

    };

    const formdata: FormData = new FormData();
    if (this.file) {
      formdata.append('file', this.file);
    }
    formdata.append('caseNumber', caseatt.caseNumber ? caseatt.caseNumber.toString() : '');
    formdata.append('caseAttId', caseatt.caseAttId ? caseatt.caseAttId.toString() : '');
    formdata.append('attachmentId', caseatt.attachmentId ? caseatt.attachmentId.toString() : '');


    this.api.uploadAttachmentApi(this.file, formdata, '/api/caseatt/createCaseAttachment').subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const response: ApiResponse<Caseatt> = <ApiResponse<Caseatt>>JSON.parse(<string>event.body);
          Utils.alertSuccess({
            text: 'Attachment has been saved.',
          });

          this.search();

          this.attCreateForm.patchValue({
            ...response.data
          });
        } else {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        }
      }
    });
    /*
        this.caseacttService.createCaseAttachment(this.file, caseatt).subscribe(event => {
          if (event instanceof HttpResponse) {
            if (event.status === 200) {
              const response: ApiResponse<Caseatt> = <ApiResponse<Caseatt>>JSON.parse(<string>event.body);
              Utils.alertSuccess({
                text: 'Attachment has been saved.',
              });
    
              this.search();
    
              this.attCreateForm.patchValue({
                ...response.data
              });
            } else {
              Utils.alertError({
                text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
              });
            }
          }
        });
        */

  }


  clear() {
    //this.searchForm.reset();
    this.clearSort();
    //this.selectedRow = null;
    this.search();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  openDialog(attId: number) {
    console.log(attId);
    if (!attId) {
      return false;
    }
    const dialogRef = this.dialog.open(ModalContentFileComponent, {
      // height: '90%',
      // width: '90%',
      // panelClass: 'my-dialog',
      // Need to send any data to modal?
      // data: { name: 'max', animal: 'dog'}

      data: {
        attId: attId,
        fileExtension: this.attCreateForm.controls['fileExtension'].value,
        fileName: this.attCreateForm.controls['fileName'].value
      }

    });

    dialogRef.afterClosed().subscribe(() => {

      console.log('Dialog result: ${result}');
    });
  }
}