import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, UntypedFormControl } from '@angular/forms';
import { RoleService } from '../role.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Utils from 'src/app/shared/utils';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

interface Resp {
  respCode?: string;
  respName?: string;
  respFlag: string;
  type?: string;
  menuId?: number;
  parentMenuId?: number;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

@Component({
  selector: 'app-responsibility',
  templateUrl: './responsibility.component.html',
  styleUrls: ['./responsibility.component.scss']
})
export class ResponsibilityComponent extends BaseComponent implements OnInit {

  accessList = [
    { codeId: 'N', codeName: 'Not Show' },
    { codeId: 'R', codeName: 'Read Only' },
    { codeId: 'RW', codeName: 'Read/Write' },
    { codeId: 'RX', codeName: 'Read/Write/Extra' },
  ];

  moduleList;

  respForm: UntypedFormGroup;
  roleCode: string;
  respList: Resp[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ResponsibilityComponent>,
    private formBuilder: UntypedFormBuilder,
    private roleService: RoleService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    this.roleCode = data.roleCode;
  }

  ngOnInit() {
    this.roleService.getRespListByRole({
      data: this.roleCode
    }).then(result => {
      if (result.status) {
        if (result.data && result.data.length > 0) {
          this.moduleList = this.transformData(result.data);
          console.log(this.moduleList);
        }
        const formConfig = {};
        this.moduleList.forEach(item => {
          const formArray = this.formBuilder.array([]);
          item.subModuleList.forEach(sub => {
            formArray.push(new UntypedFormControl(this.getRespValue(sub)));
          });
          formConfig[item.formName] = formArray;
        });
        this.respForm = this.formBuilder.group(formConfig);
        this.CHECK_FORM_PERMISSION(this.respForm);
      }
    });
  }

  transformData(respList: Resp[]) {
    return respList.filter(item => !item.parentMenuId).map((item, index) => {
      const formName = 'Form' + index + 'Array';
      const subModuleList = respList.filter(child => child.parentMenuId === item.menuId).map(sub => {
        return {
          name: sub.respName
          , flag: sub.respFlag
          , menuId: sub.menuId
        };
      });
      if (item.type === 'link') {
        subModuleList.push({
          name: item.respName
          , flag: item.respFlag
          , menuId: item.menuId
        });
      }
      return {
        moduleName: item.respName,
        formName: formName,
        subModuleList: subModuleList
      };
    });
  }

  getRespValue(element) {
    if (element && element.flag && element.menuId) {
      return element.flag + ':' + element.menuId;
    }
    return null;
  }

  trackByFn(index: number) {
    return index;
  }

  onSave() {
    console.log(this.respForm.controls);
    const respList: Resp[] = [];
    Object.keys(this.respForm.controls).forEach(key => {
      console.log('key=' + key);
      this.respForm.get(key).value.forEach(item => {
        if (item) {
          const tmp = item.split(':');
          respList.push({
            respCode: 'NOT_USE',
            respFlag: tmp[0],
            menuId: tmp[1]
          });
        }
      });
    });
    this.roleService.updateRespByRole({
      data: {
        roleCode: this.roleCode,
        respList: respList
      }
    }).then(result => {
      if (result.status) {
        this.dialogRef.close();
        Utils.alertSuccess({
          text: 'Responsibilities has been saved.',
        });
      } else {
        Utils.alertError({
          text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        });
      }
    });
  }

}
