import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthGuard } from './guard/auth.guard';

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
        loadComponent: () => import('./pages/customer/customer.component').then(m => m.CustomerComponent)
      },
      {
        path: 'customer/customer',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/customer/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent)
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
        path: 'system/sla',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/sla/sla.component').then(m => m.SlaComponent)
      },
      {
        path: 'system/holiday',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/holiday/holiday.component').then(m => m.HolidayComponent)
      },
      {
        path: 'system/email-template',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/email-template/email-template.component').then(m => m.EmailTemplateComponent)
      },
      {
        path: 'advertising',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/advertising/advertising.component').then(m => m.AdvertisingComponent)
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

export default routes;
