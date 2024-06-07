import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { AttributeService } from './attribute.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import Utils from 'src/app/shared/utils';
import { CriteriaService } from '../../criteria.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CriteriaComponent } from '../../criteria.component';
import { CriteriaData } from '../../criteria.data';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  @Input() ruleId: number;
  @Input() created: boolean;
  @Input() row: CriteriaData;

  dataTypeList: Dropdown[];

  submitted = false;
  isReadOnly = false;

  srcObjList: Dropdown[];
  dscObjList: Dropdown[];
  srcAttrList: Dropdown[];
  tmpSrcAttrList: Dropdown[];
  dscAttrList: Dropdown[];
  tmpDscAttrList: Dropdown[];

  createForm: UntypedFormGroup;
  isCompareToObject = false;
  isCompareToValue = false;
  itemString: string;

  conditionList = [
    { type: 'Text,Number,Date', condition: '=', description: 'Equals' }
    , { type: 'Text,Number,Date', condition: '<>', description: 'Does Not Equal' }
    , { type: 'Number,Date', condition: '>', description: 'Is Greater Than' }
    , { type: 'Number,Date', condition: '>=', description: 'Is Greater Than or Equal To' }
    , { type: 'Number,Date', condition: '<', description: 'Is Less Than' }
    , { type: 'Number,Date', condition: '<=', description: 'Is Less Than or Equal To' }
    , { type: 'Text', condition: 'IS_EMPTY', description: 'Is Empty' }
    , { type: 'Text', condition: 'IS_NOT_EMPTY', description: 'Is Not Empty' }
    , { type: 'Text', condition: 'STARTS_WITH', description: 'Starts With' }
    , { type: 'Text', condition: 'ENDS_WITH', description: 'Ends With' }
    , { type: 'Text', condition: 'CONTAINS', description: 'Contains' }
    , { type: 'Text', condition: 'NOT_CONTAIN', description: 'Does Not Contain' }
    , { type: 'Text', condition: 'UNDER', description: 'Under' }
  ];

  compareToList = [{ codeId: 'O', codeName: 'Object' }, { codeId: 'V', codeName: 'Value' }];

  operatorList = [{ codeId: '+', codeName: 'Add' }
    , { codeId: '-', codeName: 'Subtract' }
    , { codeId: '*', codeName: 'Multiply' }
    , { codeId: '/', codeName: 'Divide' }];

  constructor(public dialogRef: MatDialogRef<CriteriaComponent>,
    public api: ApiService, private formBuilder: UntypedFormBuilder
    , private attributeService: AttributeService, private criteriaService: CriteriaService) {
    api.getCodebookByCodeType({ data: 'PROGRAM_DATA_TYPE_ATTRIBUTE' }).then(result => { this.dataTypeList = result.data; });
    // Group first
    attributeService.getAttrGroup({ data: '' }).then(result => {
      this.srcObjList = result.data;
      this.dscObjList = result.data;
      // Attr second
      attributeService.getAttr({ data: '' }).then(attrResult => {
        this.srcAttrList = attrResult.data;
        this.dscAttrList = attrResult.data;
        // After all selector values are set
        if (!this.created) { this.updateSetting(); }
      });
    });
  }

  ngOnInit() {
    this.tmpSrcAttrList = this.srcAttrList;
    this.tmpDscAttrList = this.dscAttrList;

    this.createForm = this.formBuilder.group({
      criteriaId: [''],
      description: ['',Validators.required],
      srcObj: ['',Validators.required],
      srcAttr: ['',Validators.required],
      srcCondition: ['',Validators.required],
      compareToOv: ['',Validators.required],
      dscObj: [''],
      dscAttr: [''],
      dscOperator: [''],
      dscObjValue: [''],
      itemValue: [''],
      items: this.formBuilder.array([]),
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
    });
  }

  updateSetting() {
    this.createForm.patchValue({ criteriaId: this.row.criteriaId });
    this.createForm.patchValue({ description: this.row.description });
    this.createForm.patchValue({ srcObj: this.row.srcObj });
    this.onChangeAttrGroup(this.row.srcObj);
    this.createForm.patchValue({ srcAttr: this.row.srcAttr });
    this.createForm.patchValue({ srcCondition: this.row.srcCondition });
    this.createForm.patchValue({ compareToOv: this.row.compareToOv });

    if (this.row.compareToOv === 'O') {
      this.isCompareToObject = true;
      this.createForm.patchValue({ dscObj: this.row.dscObj });
      this.onChangeDscAttrGroup(this.row.dscObj);
      this.createForm.patchValue({ dscAttr: this.row.dscAttr });
      this.createForm.patchValue({ dscOperator: this.row.dscOperator });
      this.createForm.patchValue({ dscObjValue: this.row.dscValue });
    } else {
      this.isCompareToValue = true;
      this.row.dscValue.split(',').forEach(o => this.items.push(this.createItem(o)));
    }

    this.createForm.patchValue({ createdBy: this.row.createdBy });
    this.createForm.patchValue({ createdDate: this.row.createdDate });
    this.createForm.patchValue({ updatedBy: this.row.updatedBy });
    this.createForm.patchValue({ updatedDate: this.row.updatedDate });

  }

  createItem(value: string): UntypedFormGroup {
    return this.formBuilder.group({
      value: [value]
    });
  }

  get items(): UntypedFormArray {
    return this.createForm.get('items') as UntypedFormArray;
  }

  addItem(): void {
    if(this.createForm.controls.itemValue.value != ''){
      this.items.push(this.createItem(this.createForm.controls.itemValue.value));

      if(this.items.length > 0){
        this.createForm.get('itemValue').clearValidators();
        //this.createForm.get('itemValue').updateValueAndValidity();
      }

      this.createForm.patchValue({ itemValue: '' });
    }
  }

  removeItem(index: number): void {
    this.items.removeAt(index);

    if(this.items.length == 0){
      this.createForm.get('itemValue').setValidators([Validators.required]);
      this.createForm.patchValue({ itemValue: '' });
    }
  }

  OnSubmit(formValue: any) {

    const tmpArr = [];
    this.items.controls.forEach(con => tmpArr.push(con.value.value));
    this.itemString = tmpArr.join();
    
    if(this.createForm.get('compareToOv').value == 'V' && this.items.length == 0){
      this.createForm.get('itemValue').setValidators([Validators.required]);
      this.createForm.patchValue({ itemValue: '' });
    }
    
    this.onSave();
  }

  onSave() {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Criteria has been created.!' : 'Criteria has been updated.';
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

    this.criteriaService.saveCriteria({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.showSuccess(this.created, 'Criteria');
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });

    this.onClose();
  }

  onChangeAttrGroup(groupId: string) {
    this.tmpSrcAttrList = this.srcAttrList.filter(attr => attr.parentId === groupId);
  }

  onChangeAttr(evt) {
    console.log(evt);
  }

  onChangeCondition(evt) {
    console.log(evt);
    this.createForm.patchValue({ compareToOv: '' });
  }

  onChangeCompareTo(evt) {
    console.log(evt);

    //Clear all validators
    this.createForm.get('dscObj').clearValidators();
    this.createForm.get('dscAttr').clearValidators();
    this.createForm.get('dscOperator').clearValidators();
    this.createForm.get('dscObjValue').clearValidators();

    if (evt === 'O') {
      this.isCompareToObject = true;
      this.isCompareToValue = false;
      
      this.createForm.get('dscObj').setValidators([Validators.required]);
      this.createForm.get('dscAttr').setValidators([Validators.required]);
      this.createForm.get('itemValue').clearValidators();
      this.createForm.get('dscObj').updateValueAndValidity({onlySelf:true});
      this.createForm.get('dscAttr').updateValueAndValidity({onlySelf:true});
      this.createForm.get('itemValue').updateValueAndValidity({onlySelf:true});
    } else if (evt === 'V') {
      this.isCompareToObject = false;
      this.isCompareToValue = true;

      if(this.items.length == 0){
        this.createForm.get('itemValue').setValidators([Validators.required]);
        this.createForm.get('itemValue').updateValueAndValidity({onlySelf:true});
        this.createForm.get('dscObj').clearValidators();
        this.createForm.get('dscAttr').clearValidators();
        this.createForm.get('dscObj').updateValueAndValidity({onlySelf:true});
        this.createForm.get('dscAttr').updateValueAndValidity({onlySelf:true});
        this.createForm.get('itemValue').updateValueAndValidity({onlySelf:true});
      }

    } else {
      this.isCompareToObject = false;
      this.isCompareToValue = false;
    }
  }

  onChangeDscAttrGroup(groupId) {
    console.log(groupId);
    this.tmpDscAttrList = this.dscAttrList.filter(attr => attr.parentId === groupId);
  }

  onChangeDscAttr(evt) {
    console.log(evt);
  }

  onChangeDscOperator(evt) {
    console.log(evt);
  }

  onSelectGroup(groupId) {
    this.srcAttrList.filter(attr => attr.parentId === groupId);
  }

  onSelectAttr() {

  }

  onClose(): void {
    this.dialogRef.close();
  }

}
