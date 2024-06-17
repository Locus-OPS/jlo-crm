import { Component, OnInit, ViewChild, ElementRef, Directive, Renderer2, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from 'src/app/shared/globals';
import { TabManageService } from '../../admin/tab-manage.service';
import { Profile } from 'src/app/model/profile.model';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultingService } from 'src/app/pages/consulting/consulting.service';
import Utils from 'src/app/shared/utils';
import { CustomerService } from 'src/app/pages/customer/customer.service';
import ConsultingUtils from 'src/app/shared/consultingStore';
import { MatDialog } from '@angular/material/dialog';
import { ModalConsultingComponent } from 'src/app/pages/common/modal-consulting/modal-consulting.component';
import { FormBuilder, FormGroup } from '@angular/forms'; 

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
  templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
 
  isCollapsed = false;


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
    
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
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
    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      this.sidebarClose();

      const $layer = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }


      



    });

    this.navTitleSubscription = this.tabManageService.getNavTitle().subscribe(title => {
      this.navTitle = title;
    });

    // this.loadProfile();
  }

  ngOnDestroy() {
    this.navTitleSubscription.unsubscribe();
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
    if(path.indexOf(";")>0){
      path = path.split(";")[0];
    }
    let index = this.listTitles.findIndex(item => item.link === path);
    if (index !== -1) {
      return this.listTitles[index].name;
    } else {
      for (let i = 0 ; i < this.listTitles.length ; i++) {
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

  

 


}
