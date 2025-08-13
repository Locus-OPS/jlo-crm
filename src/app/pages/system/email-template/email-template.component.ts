


import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup, FormGroupDirective, UntypedFormBuilder, Validators } from '@angular/forms';
import { CodebookService } from '../codebook/codebook.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmailTemplateService } from './email-template.service';
import Utils from 'src/app/shared/utils';
import { EmailTemplateModel } from './email-template.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/model/api-response.model';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import Quill from 'quill';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-email-template',
    imports: [SharedModule, CreatedByComponent],
    templateUrl: './email-template.component.html',
    styleUrl: './email-template.component.scss'
})
export class EmailTemplateComponent extends BaseComponent implements OnInit {



  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  statusList: Dropdown[];
  moduleList: Dropdown[];

  file: File;

  searchForm: FormGroup;
  createForm: FormGroup;

  selectedRow: any

  sortColumn: string;
  sortDirection: string;
  displayedColumns: string[] = ['moduleName', 'statusName', 'templateName', 'createdByName', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: any[];

  pageSize = 5;
  pageNo = 0;
  total = 0;
  isUpdated = false;
  submitted = false;

  fileName: string;
  fileType: string;
  fileTempUrl: string;
  fileUrl: SafeResourceUrl;
  downloadfileUrl: SafeResourceUrl;

  uploadProgress = 0;
  modules: any = {};

  sizeInBytesLimit: number = 1000000;
  messageSizeLimit: string = "File size exceeds maximum allowed size 1MB.";

  constructor(
    public emailTemplateService: EmailTemplateService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals,
    public sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    super(router, globals);

    Quill.register('modules/imageHandler', ImageHandler);
    Quill.register('modules/videoHandler', VideoHandler);

    api.getMultipleCodebookByCodeType(
      { data: ['EMAIL_TEMPLATE_MODULE', 'ACTIVE_FLAG'] }
    ).then(result => {
      this.statusList = result.data['ACTIVE_FLAG'];
      this.moduleList = result.data['EMAIL_TEMPLATE_MODULE'];
    });

    this.translate.get(['email.file.size']).subscribe(translation => {
      this.messageSizeLimit = translation['email.file.size'];
    });
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      Id: [''],
      module: [''],
      statusCd: [''],
      templateName: [''],
      buId: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      id: [''],
      templateName: ['', Validators.required],
      statusCd: ['', Validators.required],
      attId: [''],
      module: [''],
      moduleName: [''],

      fileName: [''],
      filePath: [''],
      fileExtension: [''],

      description: [''],
      templateHtmlCode: [''],
      createdByName: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: ['']
    });

    this.modules = {
      // toolbar: [
      //   ['image', 'video']
      // ],
      imageHandler: {
        upload: (file) => {
          console.log("file" + file);
          return this.updateImageFile(file);
        },
        accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
      } as Options,
      videoHandler: {
        upload: (file) => {
          return // your uploaded video URL as Promise<string>
        },
        accepts: ['mpeg', 'avi']  // Extensions to allow for videos (Optional) | Default - ['mp4', 'webm']
      } as Options
    };

    this.onSearch();
  }




  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.emailTemplateService.getEmailTemplateList({
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



  // onAttCreate() {

  //   this.isUpdate = false;
  //   this.selectedRow = {};
  //   this.attCreateForm.reset();
  //   this.downloadfileUrl = null;
  //   this.fileUrl = null;

  //   this.attCreateForm.patchValue({ caseNumber: this.caseNumber });


  // }

  create() {
    this.selectedRow = {};
    this.createForm.reset();
    this.downloadfileUrl = null;
    this.fileUrl = null;
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.emailTemplateService.deleteEmailTemplate({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Email Template has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            });
          }
        });
      }
    });
  }

  // onSelectRow(row) {
  //   this.selectedRow = row;
  //   this.createForm.patchValue(this.selectedRow);
  // }

  onSelectRow(row: EmailTemplateModel) {

    this.selectedRow = row;
    this.createForm.patchValue({
      ...this.selectedRow
    });

    // this.fileName = this.createForm.controls['fileName'].value;
    // this.getAttachDisplay(this.createForm.controls['attId'].value);
  }

  getAttachDisplay(attId: number) {
    this.api.getAttachmentByAttId(attId).subscribe(res => {
      var resFileURL = URL.createObjectURL(res);
      console.log(res.type);
      this.fileType = res.type;
      console.log(resFileURL);
      this.fileUrl = null;
      this.downloadfileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(res));
    });

  }



  onSave() {

    if (this.createForm.invalid) {
      return;
    }

    const formdata: FormData = new FormData();
    // if (this.file) {
    //   formdata.append('file', this.file);
    // }

    const emailModel: EmailTemplateModel = {
      id: this.createForm.controls['id'].value
      , attId: this.createForm.controls['attId'].value
      , templateName: this.createForm.controls['templateName'].value
      , statusCd: this.createForm.controls['statusCd'].value
      , module: this.createForm.controls['module'].value
      , description: this.createForm.controls['description'].value
      , templateHtmlCode: this.createForm.controls['templateHtmlCode'].value
    };

    this.emailTemplateService.saveEmailTemplate(this.file, emailModel).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const response: ApiResponse<EmailTemplateModel> = <ApiResponse<EmailTemplateModel>>JSON.parse(<string>event.body);
          Utils.alertSuccess({
            text: 'Email Template has been saved.',
          });

          this.search();

          this.createForm.patchValue({
            ...response.data
          });
        } else {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        }
      }
    });
  }


  selectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.createForm.patchValue({
        fileName: this.file.name
      });
    }
  }



  uploadImage(imgFile: File) {

    this.uploadProgress = 0;

    this.emailTemplateService.uploadImage(imgFile, this.createForm.controls['id'].value).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * event.loaded / event.total);

      } else if (event instanceof HttpResponse) {
        if (event.status === 200) {
          Utils.alertSuccess({
            title: 'Uploaded!',
            text: 'Image has been updated.',
          });
          console.log(this.emailTemplateService.getImagePath(<string>event.body));
        } else {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
          //reject('Upload failed');
        }

      }
    });

  }

  checkTheFileSize(sizeInBytes: number) {

    if (sizeInBytes != null && sizeInBytes != undefined) {
      if (sizeInBytes > this.sizeInBytesLimit) {
        return true;
      } else {
        return false;
      }
    }
  }


  updateImageFile(file: File) {
    console.log("updateImageFile" + file);
    return new Promise((resolve, reject) => {

      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image

        if (!this.checkTheFileSize(file.size)) { // Customize file size as per requirement
          //  API Call
          const uploadData = new FormData();
          uploadData.append('file', file, file.name);

          this.uploadProgress = 0;

          this.emailTemplateService.uploadImage(file, this.createForm.controls['id'].value).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round(100 * event.loaded / event.total);

            } else if (event instanceof HttpResponse) {
              if (event.status === 200) {

                Utils.alertSuccess({
                  title: 'Uploaded!',
                  text: 'Image has been updated.',
                });

                const pictureUrl = this.emailTemplateService.getImagePath(<string>event.body);
                console.log(pictureUrl);
                resolve(pictureUrl);
                //RETURN IMAGE URL from response

              } else {
                Utils.alertError({
                  text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                });
                reject('Upload failed');
              }

            }

          });




        } else {
          console.log("Size too large");
          Utils.alertError({
            text: this.messageSizeLimit,
          });
          reject('Size too large');
          // Handle Image size large logic 
        }
      } else {
        reject('Unsupported type');
        console.log("Unsupported type");
        // Handle Unsupported type logic
      }
    });
  }



}