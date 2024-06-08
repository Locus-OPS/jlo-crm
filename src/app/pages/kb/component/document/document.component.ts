import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { KbService } from '../../kb.service';
import { Subscription } from 'rxjs';
import { KbStore } from '../../kb.store';
import { KbDetail, KbDocument } from '../../kb.model';
import Utils from 'src/app/shared/utils';
import { HttpResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/model/api-response.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ModalContentFileComponent } from 'src/app/pages/common/modal-file/modal-file.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'kb-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  selectedRow: KbDocument;
  dataSource: KbDocument[];
  displayedColumns: string[] = ['title', 'mainFlag', 'createdBy', 'createdDate', 'action'];

  createForm: UntypedFormGroup;
  file: File;

  kbDetailSubscription: Subscription;
  kbDetail: KbDetail = null;

  creatingContent: boolean;
  creatingDocument: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private kbService: KbService,
    private kbStore: KbStore,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog
  ) {
    super(router, globals);
    this.creatingContent = false;
    this.creatingDocument = false;
    this.kbDetailSubscription = this.kbStore.observeKbDetail().subscribe(detail => {
      if (!this.kbDetail || (this.kbDetail.contentId !== detail.contentId)) {
        this.kbDetail = detail;
        this.clearForm();
        this.search();
        this.createForm.enable();
      } else {
        this.createForm.disable();
      }
    });
  }

  ngOnDestroy() {
    this.kbDetailSubscription.unsubscribe();
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      contentAttId: [''],
      attId: [''],
      fileName: ['', Validators.required],
      fileExtension: [''],
      title: ['', Validators.required],
      descp: [''],
      mainFlag: [''],
      previousMainFlag: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    this.createForm.disable();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  clearForm() {
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.selectedRow = null;
  }

  create() {
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.creatingDocument = true;
    this.createForm.patchValue({ 'previousMainFlag':  false});
  }

  cancel() {
    if (this.selectedRow) {
      this.createForm.patchValue({
        ...this.selectedRow
      });
      Utils.convertToBoolean(this.selectedRow, this.createForm, 'mainFlag');
      this.createForm.patchValue({ 'previousMainFlag':  this.createForm.value['mainFlag']});
    } else {
      this.createForm.reset();
      if (this.createFormDirective) {
        this.createFormDirective.resetForm();
      }
    }
    this.creatingDocument = false;
  }

  search() {
    this.kbService.getKbDocumentList({
      data: this.kbDetail.contentId
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.updateMainDocument(result.data);
        if (!this.kbDetail.contentId) {
          this.creatingContent = true;
        } else {
          this.creatingContent = false;
        }
        this.creatingDocument = false;
      } else {
        this.updateMainDocument(null);
      }
    }, error => {
      this.updateMainDocument(null);
    });
  }

  updateMainDocument(docs: KbDocument[]) {
    if (docs && docs.length > 0) {
      this.kbStore.updateKbMainDocument(docs.find(doc => doc.mainFlag === 'Y'));
    } else {
      this.kbStore.updateKbMainDocument(null);
    }
  }

  selectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.createForm.patchValue({
        fileName: this.file.name
      });
    }
  }

  onDelete(row: KbDocument) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.kbService.deleteKbDocumentById({
          data: row.contentAttId
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Document has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            });
          }
        }, error => {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        });
      }
    });
  }

  onSelectRow(row: KbDocument) {
    this.selectedRow = row;
    this.createForm.patchValue({
      ...this.selectedRow
    });
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'mainFlag');
    this.createForm.patchValue({ 'previousMainFlag':  this.createForm.value['mainFlag']});
    this.creatingDocument = false;
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    let mainFlag = this.createForm.value['mainFlag'];
    let previousMainFlag = this.createForm.value['previousMainFlag'];
    if (mainFlag && !previousMainFlag) {
      this.kbService.getKbMainDocument({
        data: this.kbDetail.contentId
      }).then(result => {
        if (result.data) {
          let title = result.data.title;
          Utils.confirm("Warning", "Save this document as a primary will remove primary flag from \"" + title + "\" document, do you want to save this document?", "Save Document").then(confirm => {
            if (confirm.value) {
              this.save();
            }
          });
        } else {
          this.save();
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later - from Tier Service.',
        });
      });
    } else {
      this.save();
    }
  }

  save() {
    const kbDoc: KbDocument = {
      contentAttId: this.createForm.controls['contentAttId'].value
      , attId: this.createForm.controls['attId'].value
      , contentId: this.kbDetail.contentId
      , title: this.createForm.controls['title'].value
      , descp: this.createForm.controls['descp'].value
      , mainFlag: Utils.convertToYN(this.createForm.value['mainFlag'])
    };
    this.kbService.saveKbDocument(this.file, kbDoc).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const response: ApiResponse<KbDocument> = <ApiResponse<KbDocument>>JSON.parse(<string>event.body);
          Utils.alertSuccess({
            text: 'Document has been saved.',
          });
          this.creatingDocument = false;
          this.search();
          this.createForm.patchValue({
            ...response.data
            , mainFlag: Utils.convertToBoolean(response.data, this.createForm, 'mainFlag')
          });
        } else {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        }
      }
    });
  }

  openAttachmentDialog(attId: number) {
    const dialogRef = this.dialog.open(ModalContentFileComponent, {
    /*  height: '90%',
      width: '90%',
      panelClass: 'my-dialog',*/
      data: {
        attId: attId,
        fileExtension: this.createForm.controls['fileExtension'].value,
        fileName: this.createForm.controls['fileName'].value
      }
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
}
