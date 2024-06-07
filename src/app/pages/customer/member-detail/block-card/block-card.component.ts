import { Component, OnInit, Inject } from '@angular/core';
import { MemberCardData } from '../member-card-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { MemberService } from '../member.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-block-card',
  templateUrl: './block-card.component.html',
  styleUrls: ['./block-card.component.scss']
})
export class BlockCardComponent implements OnInit {

  blockCardForm:UntypedFormGroup;

  constructor(private memberService:MemberService ,private formBuilder:UntypedFormBuilder,public dialogRef: MatDialogRef<BlockCardComponent>,@Inject(MAT_DIALOG_DATA) public data:MemberCardData) { }

  ngOnInit(): void {
    this.blockCardForm = this.formBuilder.group({
      memberId:this.data.memberId,
      programId:this.data.programId,
      programName:this.data.programName,
      memberCardNo: this.data.memberCardNo,
      cardBlockReason: ['', Validators.required],
    });
    console.log("memberCardNo blockcard : "+ this.data.memberCardNo);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onBlockCard(): void{
    if(this.blockCardForm.invalid){
      console.log("invalid");
      return;
    }
   
    this.memberService.saveBlockCard({
      data: {
        ...this.blockCardForm.value
      }
    }).then(result => {
      if (result.status) {
        this.dialogRef.close(true);
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
