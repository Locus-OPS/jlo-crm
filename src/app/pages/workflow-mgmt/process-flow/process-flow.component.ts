import { AfterViewInit, Component, OnInit } from '@angular/core';
// import mermaid from 'mermaid';
import { ProcessFlowService } from './process-flow.service';
@Component({
  selector: 'app-process-flow',
  standalone: true,
  imports: [],
  templateUrl: './process-flow.component.html',
  styleUrl: './process-flow.component.scss'
})
export class ProcessFlowComponent implements OnInit, AfterViewInit {
  workflowData: any;

  constructor(private processFlowService: ProcessFlowService) { }

  ngOnInit(): void {
    // การตั้งค่าเบื้องต้นสำหรับ Mermaid
    // mermaid.initialize({
    //   startOnLoad: false // ไม่ให้โหลดอัตโนมัติ, ต้องการควบคุมเอง
    // });

    // ดึงข้อมูล workflow จาก API
    this.processFlowService.getWorkflowData().subscribe(data => {
      this.workflowData = data;
      this.createFlowDiagram();
    });
  }

  ngAfterViewInit(): void {
    // mermaid.contentLoaded();
  }

  createFlowDiagram(): void {
    // สร้าง string diagram จากข้อมูลที่ได้รับ
    let diagram = 'graph TD;\n';
    this.workflowData.tasks.forEach((task: any) => {
      diagram += `  ${task.id}[${task.name}];\n`;
      if (task.nextTask) {
        diagram += `  ${task.id} --> ${task.nextTask};\n`;
      }
    });

    // แสดง Diagram
    const diagramContainer = document.querySelector('.mermaid');
    if (diagramContainer) {
      diagramContainer.innerHTML = diagram;
    }

    // รัน Mermaid เพื่อแสดง Diagram
    // mermaid.contentLoaded();
  }

}

/*
{
  "workflowId": 1,
  "workflowName": "Invoice Processing",
  "tasks": [
    { "id": "A", "name": "Start Workflow", "nextTask": "B" },
    { "id": "B", "name": "Approve Invoice", "nextTask": "C" },
    { "id": "C", "name": "Process Payment", "nextTask": "D" },
    { "id": "D", "name": "Complete Workflow" }
  ]
}

*/
