import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProcessFlowService } from './process-flow.service';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { BaseComponent } from 'src/app/shared/base.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Edge, Node, ClusterNode, Layout, NgxGraphModule } from '@swimlane/ngx-graph';
import { nodes, clusters, links } from './process-flow.model';
import * as shape from 'd3-shape';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-process-flow',
    imports: [SharedModule, NgxGraphModule],
    templateUrl: './process-flow.component.html',
    styleUrl: './process-flow.component.scss'
})
export class ProcessFlowComponent extends BaseComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    private processFlowService: ProcessFlowService) {
    super(router, globals);
  }




  name = 'Tracking workflow';

  nodes: Node[] = nodes; //รายการของ Node ที่จะแสดงในกราฟ
  clusters: ClusterNode[] = clusters; //(ไม่บังคับ) ใช้สำหรับจัดกลุ่มของ Nodes

  links: Edge[] = links; //รายการของลิงก์ (edges) ระหว่าง Nodes

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

  ngOnInit() {
    this.setInterpolationType(this.curveType);

    this.processFlowService.getAllTracking().subscribe((data) => {
      this.nodes = data.nodes;
      this.links = data.links;
    });


  }

  setInterpolationType(curveType) {
    this.curveType = curveType;


    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  setLayout(layoutName: string): void {
    const layout = this.layouts.find(l => l.value === layoutName);
    this.layout = layoutName;
    if (!layout.isClustered) {
      this.clusters = undefined;
    } else {
      this.clusters = clusters;
    }
  }

  onNodeClick(value: Event) {
    //alert("dd" + '${ value }')
  }
}


