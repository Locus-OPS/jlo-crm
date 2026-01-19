import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { WorkflowTrackingService } from '../../workflow-tracking/workflow-tracking.service';
import { WorkflowMgmtService } from '../workflow-mgmt.service';
import { ClusterNode, Edge, Layout, NgxGraphModule } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import * as shape from 'd3-shape';

@Component({
    selector: 'app-workflow-preview',
    imports: [SharedModule, NgxGraphModule],
    templateUrl: './workflow-preview.component.html',
    styleUrl: './workflow-preview.component.scss'
})
export class WorkflowPreviewComponent extends BaseComponent implements OnInit {

  workflowId: any;
  workflowForm: FormGroup;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals,
    private workflowTrackingService: WorkflowTrackingService,
    private workflowMgmtService: WorkflowMgmtService,
    private cdr: ChangeDetectorRef
  ) {
    super(router, globals);

  }
  ngOnInit(): void {
    const params = this.route.firstChild.snapshot.params;
    const { workflowId } = params;
    this.initForm();
    this.workflowId = workflowId;
    this.getWorkflowDetail();
  }

  initForm() {
    this.workflowForm = this.formBuilder.group({
      workflowId: [""],
      workflowName: [""],
      description: [""],
    });
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
  zoomEnabled: boolean = false;  //เปิดหรือปิดความสามารถในการซูมกราฟ

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

  getWorkflowDetail() {
    this.workflowMgmtService.getWorkflowDetail({ data: { workflowId: this.workflowId } }).then((res) => {
      if (res.status) {
        this.workflowForm.patchValue({ ...res.data });
        this.getWorkflowGraphReview(res.data.workflowId, res.data.systemId);
      }
    });
  }

  getWorkflowGraphReview(workflowId: any, systemId: any) {
    this.workflowMgmtService.getWorkflowGraphReview({ data: { workflowId: workflowId, systemId: systemId } }).then((res) => {
      if (res.status) {
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
