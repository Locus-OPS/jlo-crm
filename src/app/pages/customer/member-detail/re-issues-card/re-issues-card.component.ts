import { Component, OnInit, Inject } from '@angular/core';
import { MemberCardData } from '../member-card-data';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MemberService } from '../member.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-re-issues-card',
  templateUrl: './re-issues-card.component.html',
  styleUrls: ['./re-issues-card.component.scss']
})
export class ReIssuesCardComponent implements OnInit {

  issueCardForm:UntypedFormGroup;

  tierList:Array<any>;

  constructor(private memberService:MemberService ,private formBuilder:UntypedFormBuilder,public dialogRef: MatDialogRef<ReIssuesCardComponent>,@Inject(MAT_DIALOG_DATA) public data:MemberCardData) { }

  ngOnInit(): void {
    this.issueCardForm = this.formBuilder.group({
      memberId:this.data.memberId,
      programId:this.data.programId,
      programName:new UntypedFormControl({value: this.data.programName, disabled: true}),
      memberCardNo: new UntypedFormControl({value: this.data.memberCardNo, disabled: true}),
      cardTierId:[this.data.cardTierId, Validators.required],
      reIssueReason: ['', Validators.required],
      reIssueCardNo: [this.data.memberCardNo]
    });

    this.memberService.getMemberTierList({data:this.data}).then(result =>{
      if (result.status) {
        this.tierList = result.data;
      }else{
        Utils.alertError({
          text: 'Please try again later.',
        });
        this.dialogRef.close();
      }
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
      this.dialogRef.close();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  reIssueCard(): void{
    if(this.issueCardForm.invalid){
      console.log("invalid");
      return;
    }
    let tierName = null;
    this.tierList.forEach(element => {
      if(element.codeId == this.issueCardForm.controls['cardTierId'].value){
        tierName = element.codeName;
      }
    });
    this.memberService.saveReIssuesCard({data:this.issueCardForm.value}).then(result =>{
      if(result.status){
        result.data.tierName=tierName;
        this.dialogRef.close(result.data);
      }else{
        Utils.alertError({
          text: 'Please, try again later',
        });
      }
    }, error => {
      console.log("error");
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
    
  }

}
