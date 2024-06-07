import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsComponent } from './buttons/buttons.component';
import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TimelineComponent } from './timeline/timeline.component';
import { UserPageComponent } from './userpage/userpage.component';
import { MaterialModule } from 'src/app/shared/module/material.module';

const ExampleRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'buttons',
        component: ButtonsComponent
      }, {
        path: 'grid',
        component: GridSystemComponent
      }, {
        path: 'icons',
        component: IconsComponent
      }, {
        path: 'notifications',
        component: NotificationsComponent
      }, {
        path: 'panels',
        component: PanelsComponent
      }, {
        path: 'sweetalert',
        component: SweetAlertComponent
      }, {
        path: 'typography',
        component: TypographyComponent
      }, {
        path: 'timeline',
        component: TimelineComponent
      }, {
        path: 'userpage',
        component: UserPageComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ButtonsComponent,
    GridSystemComponent,
    IconsComponent,
    NotificationsComponent,
    PanelsComponent,
    SweetAlertComponent,
    TypographyComponent,
    TimelineComponent,
    UserPageComponent
  ],
  imports: [
    MaterialModule,
    RouterModule.forChild(ExampleRoutes),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    })
  ]
})
export class ExampleModule { }
