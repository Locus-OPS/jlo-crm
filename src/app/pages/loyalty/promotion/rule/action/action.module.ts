import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './action.component';
import { ShowActionComponent } from './show-more/show-action.component';
import { ActionBuilderComponent } from './show-more/builder/action-builder.component';
import { SharedModule } from 'src/app/shared/module/shared.module';



@NgModule({
    declarations: [ActionComponent, ShowActionComponent, ActionBuilderComponent],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [ActionComponent]
})
export class ActionModule { }
