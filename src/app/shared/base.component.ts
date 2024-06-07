import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from './globals';
import { MenuResp } from '../model/profile.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base',
  template: `NO UI HERE`
})
export class BaseComponent {

  menuResp: MenuResp;

  constructor(
    public router: Router,
    public globals: Globals
  ) {
    let url = this.router.url;
    if(url.indexOf(";") != -1){
      url = url.split(";")[0];
    }
    this.menuResp = this.globals.profile.menuRespList.find(item => item.link === url);
  }

  public CHECK_FORM_PERMISSION(formGroup: FormGroup) {
    if (!this.CAN_WRITE()) {
      formGroup.disable();
    }
  }

  public CAN_WRITE() {
    return this.menuResp.respFlag && (this.menuResp.respFlag.indexOf('W') > -1 || this.menuResp.respFlag.indexOf('X') > -1);
  }

  public CAN_EXTRA() {
    return this.menuResp.respFlag && this.menuResp.respFlag.indexOf('X') > -1;
  }

}
