import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';

import { TabManageService, TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ConsultingService } from 'src/app/pages/consulting/consulting.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/module/shared.module';
import Utils from 'src/app/shared/utils';
@Component({
  selector: 'app-contact-history-tl',
  templateUrl: './contact-history-tl.component.html',
  styleUrl: './contact-history-tl.component.scss',
  standalone: true,
  imports: [SharedModule]
})
export class ContactHistoryTlComponent extends BaseComponent implements OnInit {
  searchForm: FormGroup;

  @Input() customerIdParam: any;

  timeLine: any = [];
  constructor(
    private tabManageService: TabManageService,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private consulting: ConsultingService,
    public router: Router,
    public globals: Globals,
    public tabParam: TabParam,
    private dialog: MatDialog,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
  ) {
    super(router, globals);
    /*https://github.com/seanyeh/fontawesome-svgs */
    /**
 01 Voice
02 Email
03 Web Chat
04 Walk in
05 Line
06 Facebook
-->
     */
    iconRegistry.addSvgIcon('voice-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/phone-square-light.svg'));
    iconRegistry.addSvgIcon('email-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/email.svg'));
    iconRegistry.addSvgIcon('webchat-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/chat.svg'));
    iconRegistry.addSvgIcon('walkin-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/walking-light.svg'));
    iconRegistry.addSvgIcon('line-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/line-brands.svg'));
    iconRegistry.addSvgIcon('fb-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/facebook-brands.svg'));

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      customerId: [this.customerIdParam]
    });

    //this.mockupDataTimeline();
    this.search();
  }




  search() {
    //alert("custId : " + this.customerIdParam)
    const param = {
      ...this.searchForm.getRawValue()
    };
    console.log(param);
    console.log(this.customerIdParam);

    this.consulting.getConsultingTimelineDataListByCustomerId({ data: param }).then((result) => {
      if (result.status) {
        this.timeLine = result.data;
      } else {
        this.timeLine = [];
      }

    },
      (error) => {
        Utils.alertError({
          text: error.message,
        });
      }
    );
  }
  mockupDataTimeline() {

    this.timeLine = [
      { channelCd: '01', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.' },
      { channelCd: '02', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.' },
      { channelCd: '03', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.' },
      { channelCd: '04', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.' },
      { channelCd: '05', detail: 'Lorem ipsum dolor sit amet, quo ei simul congue exerci, ad nec admodum perfecto mnesarchum, vim ea mazim fierent detracto. Ea quis iuvaret expetendis his, te elit voluptua dignissim per, habeo iusto primis ea eam.' }

    ]
  }

}
