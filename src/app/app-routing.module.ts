import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthGuard } from './guard/auth.guard';
import { PositionComponent } from './pages/system/position/position.component';
import { CodebookComponent } from './pages/system/codebook/codebook.component';
import { InternationalizationComponent } from './pages/system/internationalization/internationalization.component';
import { RoleComponent } from './pages/system/role/role.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MenuComponent } from './pages/system/menu/menu.component';
import { UserComponent } from './pages/system/user/user.component';
import { BusinessUnitComponent } from './pages/system/business-unit/business-unit.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
import { MemberDetailComponent } from './pages/customer/member-detail/member-detail.component';
import { CaseComponent } from './pages/case/case.component';
import { CasedetailsComponent } from './pages/case/casedetails/casedetails.component';
import { ContentComponent } from './pages/kb/content/content.component';
import { SystemModule } from './pages/system/system.module';
import { KbModule } from './pages/kb/kb.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { CustomerModule } from './pages/customer/customer.module';
import { MemberRedeemComponent } from './pages/customer/member-redeem/member-redeem.component';
import { CaseModule } from './pages/case/case.module';
import { ConsultingComponent } from './pages/consulting/consulting.component';
import { ConsultingModule } from './pages/consulting/consulting.module';
import { ChatComponent } from './pages/channel/chat/chat.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      {
        path: 'customer',
        canActivate: [AuthGuard],
        component: CustomerComponent
      },
      {
        path: 'customer/customer',
        canActivate: [AuthGuard],
        component: CustomerDetailComponent
      },
      {
        path: 'customer/member',
        canActivate: [AuthGuard],
        component: MemberDetailComponent
      },
      {
        path: 'customer/member-redeem',
        canActivate: [AuthGuard],
        component: MemberRedeemComponent
      },
      {
        path: 'case',
        canActivate: [AuthGuard],
        component: CaseComponent
      },
      {
        path: 'casedetails',
        canActivate: [AuthGuard],
        component: CasedetailsComponent
      },
      {
        path: 'kb/content/:contentType',
        canActivate: [AuthGuard],
        component: ContentComponent
      },
      {
        path: 'system/user',
        canActivate: [AuthGuard],
        component: UserComponent
      },
      {
        path: 'system/position',
        canActivate: [AuthGuard],
        component: PositionComponent
      },
      {
        path: 'system/codebook',
        canActivate: [AuthGuard],
        component: CodebookComponent
      },
      {
        path: 'system/i18n',
        canActivate: [AuthGuard],
        component: InternationalizationComponent
      },
      {
        path: 'system/role',
        canActivate: [AuthGuard],
        component: RoleComponent
      },
      {
        path: 'system/menu',
        canActivate: [AuthGuard],
        component: MenuComponent
      },
      {
        path: 'system/business-unit',
        canActivate: [AuthGuard],
        component: BusinessUnitComponent
      },
      {
        path: 'consulting/consultingList',
        canActivate: [AuthGuard],
        component: ConsultingComponent
      },
      {
        path: 'channel/chat',
        loadComponent: () => import('./pages/channel/chat/chat.component').then(m => m.ChatComponent)
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
    }]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {}),
    DashboardModule,
    SystemModule,
    CustomerModule,
    KbModule,
    CaseModule,
    ConsultingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
