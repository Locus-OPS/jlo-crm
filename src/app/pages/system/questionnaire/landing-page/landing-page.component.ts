import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SharedModule, MatRadioModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  hasKey: string;
  headerId: number;
  expiredLink: string;
  headerQuestionnaire: any;
  respondentForm: FormGroup;
  answerForm: FormGroup;
  questionnaireQuestionList: any[];

  constructor(
    //public router: Router,
    // public globals: Globals,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sanitized: DomSanitizer,
    private landingPageService: LandingPageService,
    private el: ElementRef
    //private titleService: Title,
  ) {
    // this.titleService.setTitle('Jlo CRM : Locus telecom');
  }

  ngOnInit(): void {
    this.hasKey = this.route.snapshot.paramMap.get('key');
    this.expiredLink = null;
    this.createRespondentForm();
    this.getLandingQuestionnaireMaster();
  }

  createRespondentForm() {
    this.respondentForm = this.formBuilder.group({
      respondentId: [],
      questionnaireHeaderId: [0, Validators.required],
      name: [null, Validators.required],
      age: [null, Validators.required],
      gender: [null, Validators.required],
      location: [null]
    });
  }

  getLandingQuestionnaireMaster() {

    const params = { data: { hasKey: this.hasKey } }
    this.landingPageService.getLandingQuestionnaireMaster(params).then((result: any) => {
      if (result.status) {
        if (result.data) {
          this.headerQuestionnaire = result.data;
          this.questionnaireQuestionList = result.data.questionnaireList;
          this.respondentForm.patchValue({ questionnaireHeaderId: result.data.id });
          this.headerId = result.data.id;
          this.createAnswerForm();
          // console.log(result.data);
          // this.expiredLink = "";
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

  createAnswerForm() {
    const group = {};
    this.questionnaireQuestionList.forEach(q => {
      group[q.id] = ['', q.requiredFlg ? Validators.required : null];
    });
    this.answerForm = this.formBuilder.group(group);
  }

  checkValid() {
    this.respondentForm
  }


  onSubmitQuestionnaire() {

    //Check Form respondentForm
    if (!this.respondentForm.valid) {
      this.respondentForm.markAllAsTouched();
      for (const key of Object.keys(this.respondentForm.controls)) {
        if (this.respondentForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    //
    if (!this.answerForm.valid) {
      this.answerForm.markAllAsTouched();
      for (const key of Object.keys(this.answerForm.controls)) {
        if (this.answerForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    console.log(JSON.stringify(this.respondentForm.getRawValue()));
    console.log(JSON.stringify(this.answerForm.getRawValue()));

    const respondent = this.respondentForm.getRawValue();
    const responseList = Object.entries(this.answerForm.getRawValue()).map(([key, value]) => ({ "responseText": (value).toString(), "questionId": Number(key), "questionnaireHeaderId": this.headerId }));

    Utils.confirm('Are you sure?', 'Do you want to proceed?', 'Yes')
      .then((result) => {
        if (result.isConfirmed) {
          this.landingPageService.createQuestionnaire({ data: { respodent: respondent, responses: responseList } }).then((res) => {
            if (res.status) {
              setTimeout(() => {
                location.reload(); // หรือใช้ window.location.reload();
              }, 5000);
              Utils.alertSuccess({ text: "Successfully submitted the answer." });
            } else {
              Utils.alertError({ text: res.message });
            }
          });
        } else {
          console.log('Cancelled');
        }
      });

  }

  hasRequiredError(controlName: string): boolean {
    const control = this.respondentForm.get(controlName);
    return control?.hasError('required') && control?.touched;
  }

  responseFormhasRequiredError(controlName: string): boolean {
    const control = this.answerForm.get(controlName);
    return control?.hasError('required') && control?.touched;
  }

  checkboxConcatValue(param: any, formName: any) {
    let allValue = this.answerForm.get([formName]).value;
    let isHave = allValue.includes(param);
    if (isHave) {
      allValue = allValue.replace(param, "");
    } else {
      allValue = (allValue + " " + param).trim();
    }
    this.answerForm.patchValue({ [formName]: allValue });
  }

}
