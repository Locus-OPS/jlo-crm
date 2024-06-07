import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KbService } from '../../../kb.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.scss']
})
export class NewFolderComponent extends BaseComponent implements OnInit {

  parentId: number;
  contentType: string;
  title: string;
  id: number;

  translatePrefix: string;

  createForm: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , private formBuilder: UntypedFormBuilder
    , private api: ApiService
    , private kbService: KbService
    , private dialogRef: MatDialogRef<NewFolderComponent>
    , public router: Router
    , public globals: Globals
  ) {
    super(router, globals);
    this.parentId = data.parentId;
    this.contentType = data.contentType;
    this.title = data.title;
    this.id = data.id
    this.translatePrefix = data.translatePrefix
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      contentType: [this.contentType],
      parentId: [this.parentId],
      title: [this.title, Validators.required],
      id: [this.id],
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
  }
  
  onSave() {
    if (this.createForm.invalid) {
      return;
    }
    this.kbService.saveKBFolder({
      data: {
        ...this.createForm.value
      }
    }).then(result => {
      if (result.status) {
        this.dialogRef.close(true);
      }
    });
  }
}
