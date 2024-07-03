import { Component, OnInit, ViewChild, AfterViewInit, Injector, Injectable, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute, Params, RouteConfigLoadEnd } from '@angular/router';
import { NavItem } from '../../md/md.module';
import { Subscription } from 'rxjs/Subscription';
import { Location, PopStateEvent } from '@angular/common';
import { NavbarComponent } from '../../layouts/template/navbar/navbar.component';
import PerfectScrollbar from 'perfect-scrollbar';
import { filter, tap } from 'rxjs/operators';
import { Globals } from 'src/app/shared/globals';
import { TabManageService, Tab, TabParam } from './tab-manage.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  public navItems: NavItem[];
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  url: string;
  location: Location;

  @ViewChild('sidebar') sidebar: any;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  ALLOW_ONE_TAB = [''];

  initialCount = 0;
  tabsKeys: string[] = [
    '/dashboard'
  ];

  locationSubscription: Subscription;
  tabsComponentSubscription: Subscription;
  tabsComponents: Tab[];
  selectedTab = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector,
    private globals: Globals,
    private tabManageService: TabManageService,
    location: Location
  ) {
    this.location = location;
  }

  ngOnInit() {
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    const html = document.getElementsByTagName('html')[0];
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      html.classList.add('perfect-scrollbar-on');
    } else {
      html.classList.add('perfect-scrollbar-off');
    }

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap((event: NavigationEnd) => {
        this.navbar.sidebarClose();
      })
    );

    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        if (this.tabManageService.isTab(routeChange.url)) {
          const child = this.route.snapshot.firstChild;
          if (this.tabsKeys.indexOf(routeChange.url) === -1) {
            let mode = 'C';
            let index = this.tabsComponents.length;
            const tabIndex = this.checkAllowOneTab(routeChange.url);
            if (tabIndex > -1) {
              mode = 'U';
              index = tabIndex;
              this.updateTab(index, routeChange.url);
            } else {
              this.newTab(routeChange.url);
            }

            const myParams: TabParam = {
              params: child.params,
              queryParam: child.queryParams,
              path: routeChange.url,
              index: index
            };
            const params = Injector.create({ providers: [{ provide: TabParam, useValue: myParams }], parent: this.injector });
            const title = this.getTitle(routeChange.url);

            if (mode === 'C') {
              this.tabManageService.addTab({
                title: title
                , component: child.component
                , params: params
                , path: routeChange.url
                , canClose: true
              });
              this.changeTab(this.tabsComponents.length - 1);
            } else {
              this.tabManageService.updateTab({
                title: title
                , component: child.component
                , params: params
                , path: routeChange.url
                , canClose: true
              });
              this.changeTab(tabIndex);
            }
          } else {
            this.changeTab(this.tabsKeys.indexOf(routeChange.url));
          }
        }
      });

    this.tabsComponentSubscription = this.tabManageService.getTabComponents().subscribe(tabs => {
      this.tabsComponents = tabs.slice();
    });

    this.loadTab();
  }

  getTabs() {
    return this.tabManageService.getTabs() || [
      "/dashboard"
    ];
  }

  ngOnDestroy() {
    this._router.unsubscribe();
    this.tabsComponentSubscription.unsubscribe();
  }

  loadTab() {
    const keepTabs = this.tabManageService.getTabs();
    if (keepTabs && keepTabs.length > 0) {
      this.initialCount = keepTabs.length;
      keepTabs.forEach(tab => {
        setTimeout(() => {
          this.navigate(tab, true);
        }, 10);
      });
    }
  }

  initialCurrentTab() {
    const keepTabs = this.tabManageService.getTabs();
    let currentTab = this.router.url;
    if (keepTabs && keepTabs.length > 0) {
      keepTabs.forEach((tab, idx) => {
        if (currentTab == tab) {
          this.changeTab(idx);
          return;
        }
      });
    }
  }

  checkAllowOneTab(url: string) {
    const checkUrl = this.ALLOW_ONE_TAB.find(item => url.startsWith(item));
    if (checkUrl) {
      return this.tabsKeys.findIndex(item => item.indexOf(checkUrl) > -1);
    }
    return -1;
  }

  updateTab(index: number, url: string) {
    this.tabsKeys[index] = url;
    this.tabManageService.keepTabs(this.tabsKeys);
  }

  newTab(url: string) {
    this.tabsKeys.push(url);
    this.tabManageService.keepTabs(this.tabsKeys);
  }

  removeTab(index: number) {
    this.tabsKeys = this.getTabs();
    this.tabsKeys.splice(index, 1);
    this.tabManageService.keepTabs(this.tabsKeys);
  }

  changeTab(index: number) {
    if (this.initialCount === 0) {
      setTimeout(() => {
        this.selectedTab = index;
        this.tabManageService.updateNavTitleByIndex(this.selectedTab);
      }, 1);
    } else {
      if (this.initialCount === 1) {
        this.initialCount--;
        this.changeTab(this.tabsKeys.indexOf(this.getAddressBarPath()));
      } else {
        this.initialCount--;
      }
    }
  }

  getAddressBarPath() {
    return this.location.path();
  }

  getTitle(url: string) {
    if (url.indexOf(';') !== -1) {
      url = url.substring(0, url.indexOf(';'));
    }
    try {
      return this.globals.profile.menuRespList.find(item => item.link === url).name;
    } catch (e) {
      return "undefined";
    }
  }

  selectedTabChanged(event) {
    if (event.index !== -1 && this.selectedTab !== event.index) {
      this.navigate(this.tabsComponents[event.index].path, false);
    }
  }

  navigate(url: string, skipLocationChange: boolean) {
    if (url.indexOf(';') !== -1) {
      this.router.navigate(
        [
          url.substring(0, url.indexOf(';')),
          this.mapRequestParamToObject(url.substring(url.indexOf(';') + 1))
        ], { skipLocationChange: skipLocationChange }
      );
    } else {
      this.router.navigate([url], { skipLocationChange: skipLocationChange });
    }
  }

  mapRequestParamToObject(requestParam: string) {
    const param = {};
    if (requestParam.indexOf(';') === -1) {
      const tmp = requestParam.split('=');
      param[tmp[0]] = tmp[1];
    } else {
      const paramList = requestParam.split(';');
      paramList.forEach(item => {
        const tmp = item.split('=');
        param[tmp[0]] = tmp[1];
      });
    }
    return param;
  }

  closeTab(event, i) {
    this.closeTabByIndex(i);
  }

  closeTabByIndex(i: number) {
    this.removeTab(i);
    const removedtabs = this.tabManageService.removeTab(i);
    if (this.router.url === removedtabs[0].path) {
      if (i === 0 && this.tabsComponents.length === 0) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate([this.tabsComponents[i - 1].path]);
      }
    }
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      ps.update();
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
