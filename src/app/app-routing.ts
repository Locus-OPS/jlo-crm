import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthGuard } from './guard/auth.guard';
import { SchedulerComponent } from './pages/system/scheduler/scheduler.component';
import { SchedulerHistoryLogComponent } from './pages/system/scheduler/scheduler-history-log/scheduler-history-log.component';

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
        path: 'sr',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/service-request/service-request.component').then(m => m.ServiceRequestComponent)
      },
      {
        path: 'srdetails',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/service-request/service-request-details/service-request-details.component').then(m => m.ServiceRequestDetailsComponent)
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
        path: 'system/scheduler',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/scheduler/scheduler.component').then(m => m.SchedulerComponent)
      },
      {
        path: 'system/scheduler-log',
        loadComponent: () => import('./pages/system/scheduler/scheduler-history-log/scheduler-history-log.component').then(m => m.SchedulerHistoryLogComponent)
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
        path: 'system/questionnaire',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/questionnaire/questionnaire.component').then(m => m.QuestionnaireComponent)
      },
      {
        path: 'system/questionnaire-details',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/questionnaire/questionnaire-details/questionnaire-details.component').then(m => m.QuestionnaireDetailsComponent)
      },
      {
        path: 'system/questionnaire-preview',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/questionnaire/questionnaire-preview/questionnaire-preview.component').then(m => m.QuestionnairePreviewComponent)
      },
      {
        path: 'dashboard/questionnaire-dashboard-detail',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/questionnaire-dashboard/questionnaire-dashboard-detail/questionnaire-dashboard-detail.component').then(m => m.QuestionnaireDashboardDetailComponent)
      },
      {
        path: 'system/department',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/department/department.component').then(m => m.DepartmentComponent)
      },
      {
        path: 'system/department-team',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/system/department-team/department-team.component').then(m => m.DepartmentTeamComponent)
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
        path: 'emaillog',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/email-log/email-log.component').then(m => m.EmailLogComponent)
      },
      {
        path: 'channel/chat',
        loadComponent: () => import('./pages/channel/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'email-inbound',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/email-inbound/email-inbound.component').then(m => m.EmailInboundComponent)
      }, {
        path: 'email-inbound-detail',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/email-inbound/email-inbound-detail/email-inbound-detail.component').then(m => m.EmailInboundDetailComponent)
      },
      {
        path: 'workflow/workflow-mgmt',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/workflow-mgmt/workflow-mgmt.component').then(m => m.WorkflowMgmtComponent)
      }
      , {
        path: 'workflow/workflow-mgmt-detail',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/workflow-mgmt/workflow-mgmt-detail/workflow-mgmt-detail.component').then(m => m.WorkflowMgmtDetailComponent)
      },

    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: 'login',
      loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    }]
  }, {
    path: 'landing-page/:key',
    loadComponent: () => import('./pages/system/questionnaire/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
];

export default routes;
