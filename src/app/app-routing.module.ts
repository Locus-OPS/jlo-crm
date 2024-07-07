import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthGuard } from './guard/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
import { MemberDetailComponent } from './pages/customer/member-detail/member-detail.component';
import { CaseComponent } from './pages/case/case.component';
import { CasedetailsComponent } from './pages/case/casedetails/casedetails.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { CustomerModule } from './pages/customer/customer.module';
import { MemberRedeemComponent } from './pages/customer/member-redeem/member-redeem.component';
import { CaseModule } from './pages/case/case.module';
import { ConsultingComponent } from './pages/consulting/consulting.component';
import { ConsultingModule } from './pages/consulting/consulting.module';

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
        loadComponent: () => import('./pages/kb/content/content.component').then(m => m.ContentComponent)
      },
      {
        path: 'system/user',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/user/user.component').then(m => m.UserComponent)
      },
      {
        path: 'system/position',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/position/position.component').then(m => m.PositionComponent)
      },
      {
        path: 'system/codebook',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/codebook/codebook.component').then(m => m.CodebookComponent)
      },
      {
        path: 'system/i18n',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/internationalization/internationalization.component').then(m => m.InternationalizationComponent)
      },
      {
        path: 'system/role',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/role/role.component').then(m => m.RoleComponent)
      },
      {
        path: 'system/menu',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/menu/menu.component').then(m => m.MenuComponent)
      },
      {
        path: 'system/business-unit',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/business-unit/business-unit.component').then(m => m.BusinessUnitComponent)
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
    CustomerModule,
    CaseModule,
    ConsultingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
