import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@fullcalendar/core/internal';
import { au } from '@fullcalendar/core/internal-common';
import { RenderableProps, ComponentChild } from '@fullcalendar/core/preact';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { LandingPageService } from './landing-page.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  hasKey: string;
  headerId: number;
  expiredLink: string;

  constructor(
    //public router: Router,
    // public globals: Globals,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sanitized: DomSanitizer,
    private landingPageService: LandingPageService,
    //private titleService: Title,
  ) {
    // this.titleService.setTitle('Jlo CRM : Locus telecom');
  }

  ngOnInit(): void {
    this.hasKey = this.route.snapshot.paramMap.get('key');
    this.expiredLink = null;

    this.getLandingQuestionnaireMaster();
  }

  getLandingQuestionnaireMaster() {

    const params = { data: { hasKey: this.hasKey } }
    this.landingPageService.getLandingQuestionnaireMaster(params).then((result: any) => {
      if (result.status) {
        if (result.data) {
          console.log(result.data);
          this.expiredLink = "";
        } else {
          Utils.alertError({
            text: "Data not found",
          });

        }

      } else {
        this.expiredLink = result.message;

      }

    }, (err: any) => {


      Utils.alertError({
        text: err.message,
      });
    }

    );

  }

}
