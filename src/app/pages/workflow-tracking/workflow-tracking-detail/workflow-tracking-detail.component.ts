import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { WorkflowTrackingService } from '../workflow-tracking.service';
import { WorkflowMgmtService } from '../../workflow-mgmt/workflow-mgmt.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { TableControl } from 'src/app/shared/table-control';
import * as shape from 'd3-shape';
import { Subject } from 'rxjs';
import { ClusterNode, Edge, Layout } from '@swimlane/ngx-graph';
import { clusters, links, nodes } from '../../workflow-mgmt/process-flow/process-flow.model';
// import { nodes, clusters, links } from 'src/app/pages/workflow-mgmt/process-flow/process-flow.model';

@Component({
    selector: 'app-workflow-tracking-detail',
    imports: [SharedModule],
    templateUrl: './workflow-tracking-detail.component.html',
    styleUrl: './workflow-tracking-detail.component.scss'
})
export class WorkflowTrackingDetailComponent extends BaseComponent implements OnInit {

  @Input() wfTrackingLog: any = null;
  dataSource: any[];
  dataSource1: any[];
  displayedColumns: string[] = ['taskName', 'approver', 'status', 'updatedDate'];
  tableControl: TableControl = new TableControl(() => { this.getWfTrackingDetail(); });
  wfTrackingLogForm: FormGroup;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    private workflowTrackingService: WorkflowTrackingService,
    private workflowMgmtService: WorkflowMgmtService,
    private cdr: ChangeDetectorRef
  ) {
    super(router, globals);

  }

  name = 'Tracking workflow';
  nodes: Node[] = []; //รายการของ Node ที่จะแสดงในกราฟ
  clusters: ClusterNode[] = []; //(ไม่บังคับ) ใช้สำหรับจัดกลุ่มของ Nodes

  links: Edge[] = []; //รายการของลิงก์ (edges) ระหว่าง Nodes

  layout: String | Layout = 'dagreCluster'; //ใช้กำหนดรูปแบบการจัดวาง (เช่น dagre, dagreCluster)
  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];


  // line interpolation
  curveType: string = 'Bundle'; //ใช้กำหนดรูปแบบของเส้นลิงก์
  curve: any = shape.curveLinear;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];

  draggingEnabled: boolean = true; //เปิดหรือปิดความสามารถในการลาก Nodes
  panningEnabled: boolean = true; //เปิดหรือปิดความสามารถในการเลื่อนกราฟ
  zoomEnabled: boolean = true;  //เปิดหรือปิดความสามารถในการซูมกราฟ

  zoomSpeed: number = 0.1;  //ความเร็วในการซูม
  minZoomLevel: number = 0.1; //ระดับการซูมต่ำสุดและสูงสุด
  maxZoomLevel: number = 4.0; //ระดับการซูมต่ำสุดและสูงสุด
  panOnZoom: boolean = true; //เปิดหรือปิดการเลื่อนกราฟระหว่างซูม

  autoZoom: boolean = false;  //ซูมอัตโนมัติเพื่อให้กราฟทั้งหมดแสดงในพื้นที่ที่กำหนด
  autoCenter: boolean = false;  //จัดตำแหน่งกราฟให้อยู่ตรงกลาง


  // เป็น Observable สำหรับรีเฟรชหรืออัปเดตกราฟในเหตุการณ์เฉพาะ:
  update$: Subject<boolean> = new Subject();  //รีเฟรชกราฟเมื่อมีการเปลี่ยนแปลง
  center$: Subject<boolean> = new Subject();  //จัดตำแหน่งกราฟให้อยู่ตรงกลาง
  zoomToFit$: Subject<boolean> = new Subject(); //ซูมให้กราฟทั้งหมดแสดงผลในพื้นที่

  layoutSettings = {
    orientation: 'TB', // Top to Bottom for vertical flow
  };

  // layoutSettings = {
  //   orientation: 'LR', // เรียงโหนดจากซ้ายไปขวา (Left to Right)
  //   nodePadding: 20, // ระยะห่างระหว่างโหนด
  //   rankPadding: 50, // ระยะห่างระหว่างระดับชั้น
  // };

  ngOnInit(): void {
    this.initForm();
    this.onSearch();
    this.wfTrackingLogForm.patchValue(this.wfTrackingLog);
  }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      if (changes['wfTrackingLog']) {
        if (this.wfTrackingLog != null) {
          this.onSearch();
          this.wfTrackingLogForm.patchValue(this.wfTrackingLog);
          this.cdr.detectChanges();
        }
      }
    } catch (e) {
      console.log(e);
    }

  }

  initForm() {
    this.wfTrackingLogForm = this.formBuilder.group({
      workflowId: [""],
      transactionId: [""],
      systemName: [""]
    });
  }

  onSearch() {
    this.getWfTrackingDetail();
  }

  getWfTrackingDetail() {
    this.workflowTrackingService.getWfTrackingGraph({ data: this.wfTrackingLog }).then((res) => {
      if (res.status) {
        this.dataSource = res.data.node;
        if (!res.data.node.some(node => node.id === 'start')) {
          res.data.node.unshift({ id: 'start', label: 'Start', status: '' }); // เพิ่มที่ตำแหน่งแรก
        }
        if (!res.data.node.some(node => node.id === 'end')) {
          res.data.node.push({ id: 'end', label: 'End', status: '' }); // เพิ่มที่ตำแหน่งสุดท้าย
        }
        // ตรวจหา Node ตัวแรกที่ไม่ใช่ 'start' และ 'end'
        const firstNode = res.data.node.find(node => node.id !== 'start' && node.id !== 'end');

        // เพิ่ม link จาก start ไปหา firstNode
        if (firstNode) {
          res.data.link.push({
            id: 'link_start',  // กำหนด ID ให้ลิงก์
            source: 'start',   // ID ของโหนดต้นทาง
            target: firstNode.id, // ID ของโหนดปลายทาง
          });
        }
        // ตรวจหา Node ตัวสุดท้าย (เชื่อมกับ end)
        const lastNode = [...res.data.node].reverse().find(node => node.id !== 'start' && node.id !== 'end');
        if (lastNode) {
          res.data.link.push({
            id: 'link_end',
            source: lastNode.id,
            target: 'end',
          });
        }

        this.nodes = res.data.node;
        this.links = res.data.link;


      }
    });
  }

  onSelectRow(row) {

  }

  getNodeClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'node-approved';
      case 'Pending':
        return 'node-pending';
      case 'Cancelled':
        return 'node-rejected';
      default:
        return '';
    }
  }

  getLabelClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'label-approved';
      case 'Pending':
        return 'label-pending';
      case 'In_Progress':
        return 'label-inprogress';
      case 'Cancelled':
        return 'label-rejected';
      default:
        return 'label-begin-end';
    }
  }
}
