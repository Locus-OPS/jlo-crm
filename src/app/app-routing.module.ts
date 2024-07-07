import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthGuard } from './guard/auth.guard';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
import { MemberDetailComponent } from './pages/customer/member-detail/member-detail.component';
import { CustomerModule } from './pages/customer/customer.module';
import { MemberRedeemComponent } from './pages/customer/member-redeem/member-redeem.component';

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
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
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
        loadComponent: () => import('./pages/case/case.component').then(m => m.CaseComponent)
      },
      {
        path: 'casedetails',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/case/casedetails/casedetails.component').then(m => m.CasedetailsComponent)
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
        loadComponent: () => import('./pages/consulting/consulting.component').then(m => m.ConsultingComponent)
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
      path: 'login',
      loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    }]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {}),
    CustomerModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
