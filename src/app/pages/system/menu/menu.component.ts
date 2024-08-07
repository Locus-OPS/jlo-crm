import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { MenuService } from './menu.service';
import { Menu, FlatMenuNode } from './menu.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [SharedModule, CreatedByComponent]
})
export class MenuComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild('tree', { static: true }) tree;

  statusList: Dropdown[];
  menuTypeList: Dropdown[];
  parentMenuList: Dropdown[];

  createForm: UntypedFormGroup;

  isUpdate = false;

  treeControl: FlatTreeControl<FlatMenuNode>;
  treeFlattener: MatTreeFlattener<Menu, FlatMenuNode>;
  dataSource: MatTreeFlatDataSource<Menu, FlatMenuNode>;
  activeNode: FlatMenuNode;
  activeParentId: string;
  activeId: number;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private menuService: MenuService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    this.treeControl = new FlatTreeControl<FlatMenuNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG', 'MENU_TYPE']
    }).then(
      result => {
        this.statusList = result.data['ACTIVE_FLAG'];
        this.menuTypeList = result.data['MENU_TYPE'];
      }
    );
    this.loadParentMenu();
  }

  loadParentMenu() {
    this.api.getParentMenu().then(result => { this.parentMenuList = result.data; });
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      icon: [''],
      link: [''],
      activeFlag: ['', Validators.required],
      seq: [''],
      parentMenuId: [''],
      apiPath: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: [''],

    });
    this.initTree();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  initTree() {
    this.menuService.getMenuList({
      pageSize: 1000,
      pageNo: 0,
      data: null
    }).then(result => {
      this.dataSource.data = this.convertFlatListToTree(result.data);
      if (this.activeParentId && this.activeId) {
        const activeParentNode = this.treeControl.dataNodes.findIndex(item => item.id.toString() === this.activeParentId);
        const activeNode = this.treeControl.dataNodes.findIndex(item => item.id === this.activeId);
        this.treeControl.expand(this.treeControl.dataNodes[activeParentNode]);
        this.selectNode(this.treeControl.dataNodes[activeNode]);
      }
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  create() {
    this.activeNode = null;
    this.isUpdate = false;
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.menuService.deleteMenu({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Menu has been deleted.',
            });
            this.initTree();
          } else {
            Utils.alertError({
              text: 'Menu has not been deleted.',
            });
          }
        });
      }
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.createForm.value
    };
    if (this.isUpdate) {
      response = this.menuService.updateMenu({
        data: param
      });
    } else {
      response = this.menuService.createMenu({
        data: param
      });
    }
    response.then(result => {
      if (result.status) {
        this.activeId = result.data.id;
        this.activeParentId = result.data.parentMenuId;
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Menu has been saved.',
        });
        this.loadParentMenu();
        this.initTree();
      } else {
        Utils.alertError({
          text: 'Menu has not been saved.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Menu has not been saved.',
      });
    });
  }

  selectNode(node: FlatMenuNode) {
    this.isUpdate = true;
    this.activeNode = node;
    this.createForm.patchValue({
      ...this.activeNode
    });
  }

  hasChild(_: number, node: FlatMenuNode) {
    return node.expandable;
  }

  private _transformer = (node: Menu, level: number) => {
    return {
      ...node,
      parentId: node.parentMenuId,
      expandable: node.type === '01',
      level: level,
    };
  }

  private convertFlatListToTree(list) {
    const map = {}, roots = [];
    let node: Menu, i: number;
    for (i = 0; i < list.length; i++) {
      map[list[i].id] = i;
      list[i].children = [];
    }
    for (i = 0; i < list.length; i++) {
      node = list[i];
      if (node.parentMenuId && node.parentMenuId !== '') {
        if (list[map[node.parentMenuId]] != undefined) {
          list[map[node.parentMenuId]].children.push(node);
        }

      } else {
        roots.push(node);
      }
    }
    return roots;
  }

}
