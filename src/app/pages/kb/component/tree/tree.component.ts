import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef, OnDestroy } from '@angular/core';
import { KbNode, FlatNode } from '../../kb.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { KbService } from '../../kb.service';
import { KbStore } from '../../kb.store';
import Utils from 'src/app/shared/utils';
import { Subscription } from 'rxjs';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'kb-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  imports: [SharedModule, FontAwesomeModule]
})
export class TreeComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() translatePrefix: string;

  @ViewChild('tree', { static: true }) tree;

  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<KbNode, FlatNode>;
  dataSource: MatTreeFlatDataSource<KbNode, FlatNode>;
  activeNode: FlatNode;

  // Folder and file context menu
  @ViewChild(MatMenuTrigger, { static: true }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  folder: boolean;
  rootFolder: boolean;
  firstFolder: boolean;
  lastFolder: boolean;
  firstFile: boolean;
  lastFile: boolean;

  kbTreeSubscription: Subscription;

  constructor(
    private kbService: KbService,
    private kbStore: KbStore,
    private dialog: MatDialog,
    private api: ApiService,
    public router: Router,
    public globals: Globals,
    private library: FaIconLibrary
  ) {
    super(router, globals);
    library.addIconPacks(far, fas);
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.kbTreeSubscription = this.kbStore.observeKbContentType().subscribe(contentType => {
      if (contentType) {
        this.loadKbTree();
      }
    });
  }
  ngOnDestroy(): void {
    this.kbTreeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.loadKbTree();
  }

  loadKbTree() {
    let contentType = this.kbStore.getKbContentType();
    if (contentType) {
      this.kbService.getKbTreeList({
        data: contentType
      }).then(result => {
        this.dataSource.data = this.convertFlatListToTree(result.data);
        this.tree.treeControl.expandAll();
      });
    }
  }

  selectNode(node: FlatNode) {
    this.activeNode = node;
    this.kbStore.updateKbDetail(parseInt(node.id, 10));
  }

  hasChild(_: number, node: FlatNode) {
    return node.expandable;
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

  private convertFlatListToTree(list) {
    const map = {}, roots = [];
    let node: KbNode, i: number;
    for (i = 0; i < list.length; i++) {
      map[list[i].id] = i;
      list[i].children = [];
    }
    for (i = 0; i < list.length; i++) {
      node = list[i];
      if (node.parentId !== null) {
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  onContextMenu(event: MouseEvent, item: FlatNode) {
    event.preventDefault();
    if (super.CAN_WRITE()) {
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'item': item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.rootFolder = this.isRootFolder(item);
      this.folder = this.isFolder(item);
      this.firstFolder = this.isFirstFolder(item); // Check is the first folder.
      this.lastFolder = this.isLastFolder(item); // Check is the last folder.
      this.firstFile = this.isFirstFile(item); // Check is the first file.
      this.lastFile = this.isLastFile(item); // Check is the last file.

      this.contextMenu.openMenu();
    }
  }

  private isRootFolder(item: FlatNode) {
    return item.parentId == null;
  }

  private isFolder(item: FlatNode) {
    return this.isRootFolder(item) || item.id.startsWith("C");
  }

  private isFirstFolder(item: FlatNode) {
    if (this.isRootFolder(item)) {
      return true;
    } else if (this.isFolder(item)) {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        let dataNode = this.treeControl.dataNodes[i];
        if (dataNode.parentId == item.parentId && this.isFolder(dataNode)) {
          if (dataNode.id == item.id) {
            return true;
          } else {
            return false;
          }
          break;
        }
      }
    }

    return false;
  }

  private isLastFolder(item: FlatNode) {

    if (this.isRootFolder(item)) {
      return true;
    } else if (this.isFolder(item)) {
      for (let i = this.treeControl.dataNodes.length - 1; i >= 0; i--) {
        let dataNode = this.treeControl.dataNodes[i];
        if (dataNode.parentId == item.parentId && this.isFolder(dataNode)) {
          if (dataNode.id == item.id) {
            return true;
          } else {
            return false;
          }
          break;
        }
      }
    }

    return false;
  }

  private isFirstFile(item: FlatNode) {
    if (!this.isFolder(item)) {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        let dataNode = this.treeControl.dataNodes[i];
        if (dataNode.parentId == item.parentId && !this.isFolder(dataNode)) {
          if (dataNode.id == item.id) {
            return true;
          } else {
            return false;
          }
          break;
        }
      }
    }

    return false;
  }

  private isLastFile(item: FlatNode) {

    if (!this.isFolder(item)) {
      for (let i = this.treeControl.dataNodes.length - 1; i >= 0; i--) {
        let dataNode = this.treeControl.dataNodes[i];
        if (dataNode.parentId == item.parentId && !this.isFolder(dataNode)) {
          if (dataNode.id == item.id) {
            return true;
          } else {
            return false;
          }
          break;
        }
      }
    }

    return false;
  }

  createFolder(item: FlatNode) {

    const dialogRef = this.dialog.open(NewFolderComponent, {
      height: '30%',
      width: '20%',
      panelClass: 'my-dialog',
      data: {
        id: null
        , title: null
        , parentId: item.id.replace("C", "")
        , contentType: this.kbStore.getKbContentType()
        , translatePrefix: this.translatePrefix
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
      }
    });
  }

  updateFolder(item: FlatNode) {
    const dialogRef = this.dialog.open(NewFolderComponent, {
      height: '30%',
      width: '20%',
      panelClass: 'my-dialog',
      data: {
        id: item.id.replace("C", "")
        , title: item.name
        , parentId: null
        , contentType: null
        , translatePrefix: this.translatePrefix
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
      }
    });
  }

  removeFolder(item: FlatNode) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.kbService.deleteKbFolder({
          data: item.id.replace("C", "")
        }).then(result => {
          if (result.status) {
            this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
          }
        });
      }
    });
  }

  moveUpFolder(item: FlatNode) {
    this.updateKbFolderSequence(item, 0);
  }

  moveDownFolder(item: FlatNode) {
    this.updateKbFolderSequence(item, 1);
  }

  moveUpFile(item: FlatNode) {
    this.updateKbFileSequence(item, 0);
  }

  moveDownFile(item: FlatNode) {
    this.updateKbFileSequence(item, 1);
  }

  private updateKbFolderSequence(item: FlatNode, _moveFlag) {
    this.kbService.updateKbFolderSequence({
      data: {
        catId: item.id.replace("C", "")
        , moveFlag: _moveFlag
      }
    }).then(result => {
      if (result.status) {
        this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
      }
    });
  }

  private updateKbFileSequence(item: FlatNode, _moveFlag) {
    this.kbService.updateKbFileSequence({
      data: {
        contentId: item.id
        , moveFlag: _moveFlag
      }
    }).then(result => {
      if (result.status) {
        this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
      }
    });
  }

  removeFile(item: FlatNode) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.kbService.deleteKbFile({
          data: item.id
        }).then(result => {
          if (result.status) {
            this.kbStore.loadKbContentType(this.kbStore.getKbContentType());
          }
        });
      }
    });
  }
}
