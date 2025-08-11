import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { LandingPageService } from './landing-page.service';
import Utils from 'src/app/shared/utils';
import { MatRadioModule } from '@angular/material/radio';
import { QuestionnaireService } from '../questionnaire.service';

@Component({
    selector: 'app-landing-page',
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
  showForm: boolean = false;
  errorCode: string;
  errorMsg: string;
  isSubmitted: boolean = false;


  constructor(
    //public router: Router,
    // public globals: Globals,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sanitized: DomSanitizer,
    private landingPageService: LandingPageService,
    private el: ElementRef,
    private questionnaireService: QuestionnaireService
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
          this.showForm = true;
          this.isSubmitted = false;
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
        this.showForm = false;
        this.isSubmitted = false;
        this.errorCode = result.errorCode;
        this.errorMsg = result.message;

      }

    }, (err: any) => {
      this.showForm = false;
      this.isSubmitted = false;
      this.errorCode = "500";
      this.errorMsg = err.message;
      // Utils.alertError({
      //   text: err.message,
      // });
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
              this.showForm = false;
              this.isSubmitted = true;
              setTimeout(() => {
                location.reload(); // หรือใช้ window.location.reload();
              }, 10000);
              //Utils.alertSuccess({ text: "Successfully submitted the answer." });
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
    let array = allValue.trim().split(/\s*,\s*/);

    let isFound = array.includes(param);
    if (isFound) {
      array = array.filter(item => item !== param);
    } else {
      array.push(param);
    }
    let arrayStr = (array.join(" , ").replace(/^,\s*/, ""));
    this.answerForm.patchValue({ [formName]: arrayStr });
  }

  contactAdmin() {
    alert("Locus :: Tel:0856789101");
  }

}
