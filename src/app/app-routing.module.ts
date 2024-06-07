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
import { SharedModule } from './shared/module/shared.module';
import { MenuComponent } from './pages/system/menu/menu.component';
import { UserComponent } from './pages/system/user/user.component';
import { BusinessUnitComponent } from './pages/system/business-unit/business-unit.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerDetailComponent } from './pages/customer/customer-detail/customer-detail.component';
import { MemberDetailComponent } from './pages/customer/member-detail/member-detail.component';
import { FormsModule } from '@angular/forms';
import { CaseComponent } from './pages/case/case.component';
import { CasedetailsComponent } from './pages/case/casedetails/casedetails.component';
import { ContentComponent } from './pages/kb/content/content.component';
import { ProgramComponent } from './pages/loyalty/program/program.component';
import { RewardComponent } from './pages/loyalty/reward/reward.component';
import { TransactionComponent } from './pages/loyalty/transaction/transaction.component';
import { CampaignComponent } from './pages/loyalty/campaign/campaign.component';
import { PartnerComponent } from './pages/loyalty/partner/partner.component';
import { BulkloadpointComponent } from './pages/loyalty/bulkloadpoint/bulkloadpoint.component';
import { SaleproductComponent } from './pages/loyalty/saleproduct/saleproduct.component';
import { SaleproductcategoryComponent } from './pages/loyalty/saleproductcategory/saleproductcategory.component';
import { ProductComponent } from './pages/loyalty/product/product.component';
import { ShopComponent } from './pages/loyalty/shop/shop.component';
import { PromotionComponent } from './pages/loyalty/promotion/promotion.component';
import { LoyaltyModule } from './pages/loyalty/loyalty.module';
import { SystemModule } from './pages/system/system.module';
import { KbModule } from './pages/kb/kb.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { CustomerModule } from './pages/customer/customer.module';
import { CommonModule } from './pages/common/common.module';
import { TransactionReceiptComponent } from './pages/loyalty/transaction-receipt/transaction-receipt.component';
import { TransactionManualPointComponent } from './pages/loyalty/transaction-manualpoint/transaction-manualpoint.component';
import { MemberRedeemComponent } from './pages/customer/member-redeem/member-redeem.component';
import { LineModule } from './pages/line/line.module';
import { LineLiffComponent } from './pages/line/liff.component';
import { LineMemberRedeemComponent } from './pages/line/member-redeem/line-member-redeem.component';
import { LineMemberRedeemHistoryComponent } from './pages/line/member-redeem-history/line-member-redeem-history.component';
import { LineRewardDetailComponent } from './pages/line/reward-detail/reward-detail.component';
import { LineReceiptUploadComponent } from './pages/line/receipt-upload/receipt-upload.component';
import { LineReceiptApproveComponent } from './pages/line/receipt-approve/receipt-approve.component';
import { LineXcashDetailComponent } from './pages/line/xcash-detail/xcash-detail.component';
import { LineRewardAddressComponent } from './pages/line/reward-address/reward-address.component';

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
        path: 'loyalty/program',
        canActivate: [AuthGuard],
        component: ProgramComponent
      },
      {
        path: 'loyalty/promotion',
        canActivate: [AuthGuard],
        component: PromotionComponent
      },
      {
        path: 'loyalty/product',
        canActivate: [AuthGuard],
        component: ProductComponent
      },
      {
        path: 'loyalty/reward',
        canActivate: [AuthGuard],
        component: RewardComponent
      },
      {
        path: 'loyalty/campaign',
        canActivate: [AuthGuard],
        component: CampaignComponent
      },
      {
        path: 'loyalty/shop',
        canActivate: [AuthGuard],
        component: ShopComponent
      },
      {
        path: 'loyalty/partner',
        canActivate: [AuthGuard],
        component: PartnerComponent
      },
      {
        path: 'loyalty/bulkloadpoint',
        canActivate: [AuthGuard],
        component: BulkloadpointComponent
      },
      {
        path: 'loyalty/sale-product',
        canActivate: [AuthGuard],
        component: SaleproductComponent
      },
      {
        path: 'loyalty/sale-product-category',
        canActivate: [AuthGuard],
        component: SaleproductcategoryComponent
      },
      {
        path: 'loy-transaction/transaction',
        canActivate: [AuthGuard],
        component: TransactionComponent
      },
      {
        path: 'loy-transaction/receipt',
        canActivate: [AuthGuard],
        component: TransactionReceiptComponent
      },
      {
        path: 'loy-transaction/manualpoint',
        canActivate: [AuthGuard],
        component: TransactionManualPointComponent
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
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
    }]
  }, {
    path: 'line-liff/redeem',
    component: LineMemberRedeemComponent
  }, {
    path: 'line-liff/redeem-history',
    component: LineMemberRedeemHistoryComponent
  }, {
    path: 'line-liff/reward-detail',
    component: LineRewardDetailComponent
  }, {
    path: 'line-liff/reward-address',
    component: LineRewardAddressComponent
  }, {
    path: 'line-liff/xcash-detail',
    component: LineXcashDetailComponent
  }, {
    path: 'line-liff/receipt-upload',
    component: LineReceiptUploadComponent
  }, {
    path: 'line-liff/receipt-approve',
    component: LineReceiptApproveComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {}),
    SharedModule,
    FormsModule,
    CommonModule,
    DashboardModule,
    SystemModule,
    CustomerModule,
    KbModule,
    LoyaltyModule,
    LineModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
