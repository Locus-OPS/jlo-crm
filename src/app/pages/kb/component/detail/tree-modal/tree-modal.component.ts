import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KbNode, FlatNode } from '../../../kb.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { KbService } from '../../../kb.service';
import Utils from 'src/app/shared/utils';
import { KbStore } from '../../../kb.store';

@Component({
  selector: 'app-tree-modal',
  templateUrl: './tree-modal.component.html',
  styleUrls: ['./tree-modal.component.scss']
})
export class TreeModalComponent implements OnInit {

  private catId: number;

  @ViewChild('tree', { static: true }) tree;

  public treeControl: FlatTreeControl<FlatNode>;
  public treeFlattener: MatTreeFlattener<KbNode, FlatNode>;
  public treeDataSource: MatTreeFlatDataSource<KbNode, FlatNode>;
  public activeNode: FlatNode;
  public translatePrefix: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
    , private kbService: KbService
    , private kbStore: KbStore
    , private dialogRef: MatDialogRef<TreeModalComponent>
  ) {
    this.catId = data.catId;

    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
    this.treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.translatePrefix = data.translatePrefix;
  }

  ngOnInit() {
    this.kbService.getKbTreeFolderList({
      data: this.kbStore.getKbContentType()
    }).then(result => {
      this.treeDataSource.data = this.convertFlatListToTree(result.data);
      this.tree.treeControl.expandAll();
    });
  }

  private _transformer = (node: KbNode, level: number) => {
    return {
      id: node.id,
      parentId: node.parentId,
      expandable: node.folder,
      name: node.title,
      level: level,
      icon: node.icon
    };
  }

  selectNode(node: FlatNode) {
    this.activeNode = node;
  }

  confirmSelect() {
    if (!this.activeNode) {
      Utils.alertError({ text: 'Please select a folder.'});
      return;
    }
    this.dialogRef.close(this.activeNode);
  }

  onCancelSelect() {
    this.dialogRef.close(null);
  }

  private convertFlatListToTree(list) {
    const map = {}, roots = [];
    let node: KbNode, i: number;
    for (i = 0; i < list.length; i++) {
      if (list[i].parentId != null) {
        map[list[i].id] = i;
        list[i].children = [];
      }
    }
    for (i = 0; i < list.length; i++) {
      if (list[i].parentId != null) {
        node = list[i];
        if (node.parentId !== '0') {
          list[map[node.parentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
    }
    return roots;
  }

  hasChild(_: number, node: FlatNode) {
    return node.expandable;
  }
}
