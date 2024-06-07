import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { AttributeService } from './attribute.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import Utils from 'src/app/shared/utils';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ActionData } from '../../action.data';
import { ActionComponent } from '../../action.component';
import { ActionService } from '../../action.service';

@Component({
  selector: 'app-action-builder',
  templateUrl: './action-builder.component.html',
  styleUrls: ['./action-builder.component.scss']
})
export class ActionBuilderComponent implements OnInit {


  @Input() ruleId: number;
  @Input() programId: number;
  @Input() created: boolean;
  @Input() row: ActionData;

  dataTypeList: Dropdown[];

  submitted = false;
  isReadOnly = false;

  updObjList: Dropdown[];
  withObjList: Dropdown[];

  updAttrList: Dropdown[];
  tmpUpdAttrList: Dropdown[];

  withAttrList: Dropdown[];
  tmpWithAttrList: Dropdown[];

  pointTypeList: Dropdown[];
  filteredPointTypeList: Dropdown[];

  pointExpireUnitList: Dropdown[];

  createForm: UntypedFormGroup;
  isCompareToObject = false;
  isCompareToValue = false;
  itemString: string;

  selectedActionType: string;

  /* conditionList = [
      { type: 'Text,Number,Date' , condition: '=', description: 'Equals' }
    , { type: 'Text,Number,Date' , condition: '<>', description: 'Does Not Equal' }
    , { type: 'Number,Date' , condition: '>', description: 'Is Greater Than' }
    , { type: 'Number,Date' , condition: '>=', description: 'Is Greater Than or Equal To' }
    , { type: 'Number,Date' , condition: '<', description: 'Is Less Than' }
    , { type: 'Number,Date' , condition: '<=', description: 'Is Less Than or Equal To' }
    , { type: 'Text' , condition: 'IS_EMPTY', description: 'Is Empty' }
    , { type: 'Text' , condition: 'IS_NOT_EMPTY', description: 'Is Not Empty' }
    , { type: 'Text' , condition: 'STARTS_WITH', description: 'Starts With' }
    , { type: 'Text' , condition: 'ENDS_WITH', description: 'Ends With' }
    , { type: 'Text' , condition: 'CONTAINS', description: 'Contains' }
    , { type: 'Text' , condition: 'NOT_CONTAIN', description: 'Does Not Contain' }
    , { type: 'Text' , condition: 'UNDER', description: 'Under' }
  ]; */

  //compareToList = [ {codeId: 'O', codeName: 'Object'}, {codeId: 'V', codeName: 'Value'}];

  actionTypeList = [ {codeId: 'Earning', codeName: 'Earning'},
  {codeId: 'Burning', codeName: 'Burning'}, {codeId: 'Update', codeName: 'Update'}];

  updOperatorList = [  {codeId: '+', codeName: 'Add'}
                  , {codeId: '-', codeName: 'Subtract'}
                  , {codeId: '*', codeName: 'Multiply'}
                  , {codeId: '/', codeName: 'Divide'}];

  withOperatorList = [  {codeId: '+', codeName: 'Add'}
                  , {codeId: '-', codeName: 'Subtract'}
                  , {codeId: '*', codeName: 'Multiply'}
                  , {codeId: '/', codeName: 'Divide'}];

  operatorList = [  {codeId: '+', codeName: 'Add'}
                  , {codeId: '-', codeName: 'Subtract'}
                  , {codeId: '*', codeName: 'Multiply'}
                  , {codeId: '/', codeName: 'Divide'}];

  constructor( public dialogRef: MatDialogRef<ActionComponent>,
    public api: ApiService, private formBuilder: UntypedFormBuilder
    , private attributeService: AttributeService, private actionService: ActionService) {
    //api.getCodebookByCodeType({ data: 'PROGRAM_DATA_TYPE_ATTRIBUTE' }).then(result => { this.dataTypeList = result.data; });

    api.getCodebookByCodeType({ data: 'UNIT_PERIOD' }).then(result => { this.pointExpireUnitList = result.data; });

    attributeService.getPointType({data: ''}).then( result => {
      this.pointTypeList = result.data;
      this.filteredPointTypeList = this.pointTypeList.filter( i => +i.etc1 === this.programId);
    });
    // Group first
    attributeService.getAttrGroup({data: ''}).then( result => {
      this.updObjList = result.data;
      this.withObjList = result.data;
    // Attr second
      attributeService.getAttr({data: ''}).then( attrResult => {
        this.updAttrList = attrResult.data;
        this.withAttrList = attrResult.data;
        // After all selector values are set
        if (!this.created) { this.updateSetting(); }
      });
    });
  }

  ngOnInit() {
    console.log('created ----------------------------->', this.created);
    console.log('row ----------------------------->', this.row);

    this.tmpUpdAttrList = this.updAttrList;
    this.tmpWithAttrList = this.withAttrList;

    this.createForm = this.formBuilder.group({

      actionId: [''],
      ruleId: [''],
      promotionId: [''],

      actionType: ['', Validators.required],
      actionDetail: ['', Validators.required],

      pointType: [''],
      pointOperator: [''],
      pointValue: [''],
      pointExpireUnit: [''],
      pointExpirePeriod: [''],

      updObj: [''],
      updAttr: [''],
      updOperator: [''],

      withObj: [''],
      withAttr: [''],
      withOperator: [''],
      withValue: [''],
      exp: [''],

      actionQuery: [''],
      useTxnPointTypeFlag: [''],

      pointExpireDate: [''],

      updGroup: [''],
      updName: [''],
      updObject: [''],
      updField: [''],
      updDataTypeId: [''],

      withGroup: [''],
      withName: [''],
      withObject: [''],
      withField: [''],
      withDataTypeId: [''],
      pointTypeId: [''],

      createdDate: [''],
      createdBy: [''],

      updatedDate: [''],
      updatedBy: ['']

    });


  }

  updateSetting() {

    console.log('updateSetting.......');
    console.log('updateSetting.......this.row', this.row);
    this.createForm.patchValue(this.row);
    //this.createForm.patchValue({pointType: this.row.pointType.toString()});
    this.selectedActionType = this.row.actionType;
    // this.createForm.patchValue({srcObj: this.row.srcObj});
    this.onChangeUpdAttrGroup(this.row.updObj);
    this.createForm.patchValue({updAttr: this.row.updAttr});
    this.onChangeWithAttrGroup(this.row.withObj);
    this.createForm.patchValue({withAttr: this.row.withAttr});
    // this.createForm.patchValue({srcCondition: this.row.srcCondition});
    // this.createForm.patchValue({compareToOv: this.row.compareToOv});


  }
/*
  createItem(value: number): FormGroup {
    return this.formBuilder.group({
      value: [value]
    });
  } */
/*
  get items(): FormArray {
    return this.createForm.get('items') as FormArray;
  } */
/*
  addItem(): void {
    this.items.push(this.createItem(this.createForm.controls.itemValue.value));
    this.createForm.patchValue({itemValue: ''});
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }
 */
  OnSubmit(formValue: any) {

    /* const tmpArr = [];
    this.items.controls.forEach( con => tmpArr.push(con.value.value));
    this.itemString = tmpArr.join();
 */
    this.onSave();
  }

  onSave() {
    console.log('----------------------------->', this.created);
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Action has been created.!' : 'Action has been updated.';
    const param = {
      ...this.createForm.value
      , ruleId: this.ruleId
      , dscValue: this.itemString
     /*  , createdBy:this.row.createdBy
      , createdDate:this.row.createdDate
      , updatedBy:this.row.updatedBy
      , updatedDate:this.row.updatedDate */
    };

    if (this.createForm.invalid) {
      return;
    }

    this.actionService.saveAction({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.created, 'Action');
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });

    this.onClose();
  }

  onChangeUpdAttrGroup(groupId: string){
    this.tmpUpdAttrList = this.updAttrList.filter(attr => attr.parentId === groupId);
  }

  onChangeWithAttrGroup(groupId: string){
    this.tmpWithAttrList = this.withAttrList.filter(attr => attr.parentId === groupId);
    if(groupId != null && groupId != '' ){
      this.createForm.get('withAttr').setValidators([Validators.required]);
      this.createForm.get('withAttr').patchValue('');
    }else{
      this.createForm.get('withAttr').clearValidators();
      this.createForm.get('withAttr').reset();
    }
  }

  onChangePointOperator(operrator : any){
    if(operrator != null && operrator != ''){
      this.createForm.get('pointValue').setValidators([Validators.required]);
      this.createForm.get('pointValue').patchValue('');
    }else{
      this.createForm.get('pointValue').clearValidators();
      this.createForm.get('pointValue').reset();
    }
  }

  onChangeActionType(actionType: any){
    console.log('actionType======>', actionType);
    this.selectedActionType = actionType;

    if(this.selectedActionType != null){
      if(this.selectedActionType == 'Earning' || this.selectedActionType === 'Burning'){
        //clear updXxxx validator
        this.createForm.get('updObj').reset();
        this.createForm.get('updAttr').reset();
        this.createForm.get('updOperator').reset();
  
        this.createForm.get('pointType').setValidators([Validators.required]);
        //this.createForm.get('pointOperator').setValidators([Validators.required]);
  
      }else if(this.selectedActionType == 'Update'){
  
        this.createForm.get('pointOperator').reset();
        this.createForm.get('pointValue').reset();
        this.createForm.get('pointExpireUnit').reset();
        this.createForm.get('pointExpirePeriod').reset();
  
        this.createForm.get('updObj').setValidators([Validators.required]);
        this.createForm.get('updAttr').setValidators([Validators.required]);
        this.createForm.get('updOperator').setValidators([Validators.required]);
  
      }
      
      // this.createForm.get('withObj').setValidators([Validators.required]);
      // this.createForm.get('withAttr').setValidators([Validators.required]);
      
    }else{
      this.createForm.reset();
    }
  }

  onChangePointExpireUnit(e){
    if(e != '' && e != null){
      this.createForm.get('pointExpirePeriod').setValidators([Validators.required]);
      this.createForm.get('pointExpirePeriod').patchValue('');
    }else{
      this.createForm.get('pointExpirePeriod').clearValidators();
      this.createForm.get('pointExpirePeriod').patchValue('');
    }
    
  }

  onChangeWithOperator(e){
    if(e != '' && e != null){
      this.createForm.get('withValue').setValidators([Validators.required]);
      this.createForm.get('withValue').patchValue('');
    }else{
      this.createForm.get('withValue').clearValidators();
      this.createForm.get('withValue').patchValue('');
    }
    
  }
  /*
  onChangeAttr(evt){
    console.log(evt);
  }

  onChangeCondition(evt){
    console.log(evt);
    this.createForm.patchValue({compareToOv: ''});
  }

  onChangeCompareTo(evt){
    console.log(evt);
    if(evt === 'O'){
      this.isCompareToObject = true;
      this.isCompareToValue = false;
    } else if (evt === 'V') {
      this.isCompareToObject = false;
      this.isCompareToValue = true;
    } else {
      this.isCompareToObject = false;
      this.isCompareToValue = false;
    }
  } */

/*   onChangeDscAttrGroup(groupId){
    console.log(groupId);
    this.tmpDscAttrList = this.dscAttrList.filter(attr => attr.parentId === groupId);
  }

  onChangeDscAttr(evt){
    console.log(evt);
  }

  onChangeDscOperator(evt){
    console.log(evt);
  }

 */
  /* onSelectGroup(groupId){
    this.srcAttrList.filter(attr => attr.parentId === groupId);
  } */

  /* onSelectAttr(){

  } */

  onClose(): void {
    console.log('...closing...');
    this.dialogRef.close();
  }

}
