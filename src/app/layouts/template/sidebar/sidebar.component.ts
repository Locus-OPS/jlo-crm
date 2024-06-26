import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { Profile } from 'src/app/model/profile.model';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { versions } from 'src/environments/versions';
import { RouteInfo } from 'src/app/model/route.model';
import TokenUtils from 'src/app/shared/token-utils';
import { TabManageService } from '../../admin/tab-manage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ["./sidebar.component.scss"],
})

export class SidebarComponent implements OnInit {

  public menuItems: RouteInfo[];
  ps: any;
  profile: Profile;

  BUILD_TIME;
  REVISION;

  constructor(
    private globals: Globals,
    public router: Router,
    public api: ApiService,
    private spinner: NgxSpinnerService,
    private tabManageService: TabManageService
  ) { }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.BUILD_TIME = versions.date;
    this.REVISION = versions.revision;

    this.loadProfile();
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      this.ps = new PerfectScrollbar(elemSidebar);
    }
  }

  loadProfile() {
    this.profile = this.globals.profile;
    this.menuItems = this.globals.menuItems;
  }

  logout() {
    this.spinner.show();
    this.globals.clear();
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.tabManageService.removeTabs();
      this.spinner.hide();
    }, 1000);
  }

  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }
}
