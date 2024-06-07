import { Injectable, Injector } from '@angular/core';
import { Params } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { TranslateService } from '@ngx-translate/core';
import { NavTitle } from '../template/navbar/navbar.component';

export interface Tab {
  title: string;
  titleParam?: any;
  component: any;
  params: Params;
  path: string;
  canClose: boolean;
}

export class TabParam {
  params: Params;
  queryParam: Params;
  path: string;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class TabManageService {

  TAB_KEY = 'TAB_KEY';
  BLACK_LIST = ['/login'];

  INIT_TABS = [
    {
      title: 'menu.dashboard',

      component: DashboardComponent,
      params: null,
      path: '/dashboard',
      canClose: false
    }
  ];
  INIT_NAV_TITLE: NavTitle = {
    title: 'menu.dashboard'
  };

  private tabsComponents: Tab[] = this.INIT_TABS.slice();

  private tabComponentsSubject = new BehaviorSubject<Tab[]>(this.INIT_TABS);
  private navTitleSubject = new BehaviorSubject<NavTitle>(this.INIT_NAV_TITLE);

  constructor(
    private translateService: TranslateService
  ) {
  }

  getTabComponents(): Observable<Tab[]> {
    return this.tabComponentsSubject.asObservable();
  }

  getNavTitle(): Observable<NavTitle> {
    return this.navTitleSubject.asObservable();
  }

  addTab(tab: Tab) {
    this.tabsComponents.push(tab);
    this.tabComponentsSubject.next(this.tabsComponents);
  }

  removeTab(index: number) {
    const removedtabs = this.tabsComponents.splice(index, 1);
    this.tabComponentsSubject.next(this.tabsComponents);
    return removedtabs;
  }

  changeTitle(index: number, title: string, titleParam: any) {
    this.tabsComponents[index].title = title;
    this.tabsComponents[index].titleParam = titleParam;
    this.tabComponentsSubject.next(this.tabsComponents);

    this.updateNavTitle(title, titleParam);
  }

  updateNavTitleByIndex(index: number) {
    if (index !== -1) {
      this.updateNavTitle(this.tabsComponents[index].title, this.tabsComponents[index].titleParam);
    }
  }

  updateNavTitle(title: string, param: any) {
    this.navTitleSubject.next({
      title, param
    });
  }

  isTab(url: string) {
    if (url.indexOf(';') !== -1) {
      return this.BLACK_LIST.findIndex(item => item === url.split(';')[0]) === -1;
    } else {
      return this.BLACK_LIST.findIndex(item => item === url) === -1;
    }
  }

  keepTabs(tabs) {
    sessionStorage.setItem(this.TAB_KEY, JSON.stringify(tabs));
  }

  getTabs() {
    const tabs = sessionStorage.getItem(this.TAB_KEY);
    if (tabs) {
      return JSON.parse(tabs);
    }
    return null;
  }

  removeTabs() {
    sessionStorage.removeItem(this.TAB_KEY);
    this.tabsComponents = this.INIT_TABS.slice();
    this.tabComponentsSubject.next(this.tabsComponents);
    this.navTitleSubject.next(this.INIT_NAV_TITLE);
  }

}
