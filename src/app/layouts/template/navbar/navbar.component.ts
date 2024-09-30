import { Component, OnInit, ViewChild, ElementRef, Directive, Renderer2, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/shared/globals';
import { TabManageService } from '../../admin/tab-manage.service';
import { Profile } from 'src/app/model/profile.model';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ConsultingInfoComponent } from '../consulting-info/consulting-info.component';

import { interval, Subscription } from 'rxjs';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

export interface NavTitle {
  title: string;
  param?: any;
}

@Component({
  selector: 'app-navbar-cmp',
  templateUrl: 'navbar.component.html',
  standalone: true,
  imports: [SharedModule, ConsultingInfoComponent]
})
export class NavbarComponent implements OnInit, OnDestroy {

  isCollapsed = false;

  subscription: Subscription;
  intervalId: number;
  hiddenNoti = false;
  countNew: number = 0;
  countWorking: number = 0;
  countEscalated: number = 0;
  countClosed: number = 0;
  systemConfigList: Dropdown[];
  systemConfigTempList: Dropdown[];
  systemConfigFilter: Dropdown;
  intervalSouce: number = 10000;
  selViewBy: any;


  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private nativeElement: Node;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;

  private navTitleSubscription: Subscription;
  navTitle: NavTitle;

  profile: Profile;

  currentLang = 'th';



  @ViewChild('app-navbar-cmp') button: any;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private translate: TranslateService,
    private globals: Globals,
    private tabManageService: TabManageService,
    public api: ApiService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,

  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.selViewBy = "01";

    this.listTitles = this.globals.menuItems;

    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    if (body.classList.contains('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    }
    if (body.classList.contains('hide-sidebar')) {
      misc.hide_sidebar_active = true;
    }

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap((event: NavigationEnd) => {
        this.sidebarClose();
        const $layer = document.getElementsByClassName('close-layer')[0];
        if ($layer) {
          $layer.remove();
        }
      })
    );
    // this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
    //   this.sidebarClose();
    //   const $layer = document.getElementsByClassName('close-layer')[0];
    //   if ($layer) {
    //     $layer.remove();
    //   }
    // });

    this.navTitleSubscription = this.tabManageService.getNavTitle().subscribe(title => {
      this.navTitle = title;
    });

    // this.loadProfile();

    this.api.getMultipleCodebookByCodeType(
      { data: ['SYS_CONFIG'] }
    ).then(result => {
      this.systemConfigList = result.data['SYS_CONFIG'];
      this.systemConfigList = this.systemConfigList.filter(vl => vl.codeId == '01');

      if (this.systemConfigList.length > 0) {
        this.systemConfigFilter = this.systemConfigList[0];
        this.intervalSouce = Number(this.systemConfigFilter.etc1);
        console.log("1intervalSouce : " + this.intervalSouce);
      } else {
        this.intervalSouce = this.intervalSouce;
      }

      const source = interval(this.intervalSouce);
      const text = 'get count case number every ' + this.intervalSouce + ' milliseconds ';
      this.getCountCaseEachStatus(text);
      // This is get count case number

      this.subscription = source.subscribe((val) => this.getCountCaseEachStatus(text));

    });



  }

  ngOnDestroy() {
    this.navTitleSubscription.unsubscribe();

    // For method 1
    this.subscription && this.subscription.unsubscribe();
  }

  changeLanguage(event) {
    this.currentLang = event.value;
    this.translate.use(event.value);
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName('body')[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove('sidebar-mini');
      misc.sidebar_mini_active = false;

    } else {
      setTimeout(function () {
        body.classList.add('sidebar-mini');

        misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }
  hideSidebar() {
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('sidebar')[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove('hide-sidebar');
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove('animation');
      }, 600);
      sidebar.classList.add('animation');

    } else {
      setTimeout(function () {
        body.classList.add('hide-sidebar');
        misc.hide_sidebar_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  onResize(event) {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  sidebarOpen() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    setTimeout(function () {
      $toggle.classList.add('toggled');
    }, 430);

    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');


    if (body.querySelectorAll('.main-panel')) {
      document.getElementsByClassName('main-panel')[0].appendChild($layer);
    } else if (body.classList.contains('off-canvas-sidebar')) {
      document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
    }

    setTimeout(function () {
      $layer.classList.add('visible');
    }, 100);

    $layer.onclick = function () { //asign a function
      body.classList.remove('nav-open');
      this.mobile_menu_visible = 0;
      this.sidebarVisible = false;

      $layer.classList.remove('visible');
      setTimeout(function () {
        $layer.remove();
        $toggle.classList.remove('toggled');
      }, 400);
    }.bind(this);

    body.classList.add('nav-open');
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  };
  sidebarClose() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    var $layer = document.createElement('div');
    $layer.setAttribute('class', 'close-layer');

    this.sidebarVisible = false;
    body.classList.remove('nav-open');
    // $('html').removeClass('nav-open');
    body.classList.remove('nav-open');
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function () {
      $toggle.classList.remove('toggled');
    }, 400);

    this.mobile_menu_visible = 0;
  };
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    let path = this.location.prepareExternalUrl(this.location.path());
    if (path.indexOf('#') === 0) {
      path = path.substr(1);
    }
    if (path.indexOf(";") > 0) {
      path = path.split(";")[0];
    }
    let index = this.listTitles.findIndex(item => item.link === path);
    if (index !== -1) {
      return this.listTitles[index].name;
    } else {
      for (let i = 0; i < this.listTitles.length; i++) {
        const item = this.listTitles[i];
        if (item.children && item.children.length > 0) {
          index = item.children.findIndex(child => child.link === path);
          if (index !== -1) {
            return item.children[index].name;
          }
        }
      }
    }
    return 'Unknown';
  }
  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }



  // loadProfile() {
  //   this.profile = this.globals.profile;
  // }

  // logout() {
  //   this.spinner.show();
  //   this.globals.clear();
  //   setTimeout(() => {
  //     this.router.navigate(['/login']);
  //     this.tabManageService.removeTabs();
  //     this.spinner.hide();
  //   }, 1000);
  // }


  closeAll() {
    console.log("remove tab all");
    this.tabManageService.removeTabs();
    window.location.href = "/";
  }


  toggleBadgeVisibility() {
    this.hiddenNoti = !this.hiddenNoti;
  }





  getCountCaseEachStatus(text) {
    console.log("getCountCaseEachStatus : " + text)
    const params = { data: { viewBy: this.selViewBy } };

    this.dashboardService.getCountCaseEachStatus(params).then((result: any) => {
      //this.spinner.hide("approve_process_spinner");
      if (result.status) {
        console.log(result.data);
        this.countNew = result.data.countNew;
        this.countWorking = result.data.countWorking;
        this.countEscalated = result.data.countEscalated;
        this.countClosed = result.data.countClosed;
      } else {

      }
    }, (err: any) => {
      console.log(err.message);
    });

  }


}
