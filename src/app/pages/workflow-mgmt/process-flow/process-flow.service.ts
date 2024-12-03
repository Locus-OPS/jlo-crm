import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { WorkflowTracking } from './process-flow.model';


@Injectable({
  providedIn: 'root'
})
export class ProcessFlowService {
  private apiUrl = 'https://your-backend-api-endpoint.com/your-endpoint'; // URL ของ API

  constructor(
    private api: ApiService,
    private http: HttpClient

  ) { }

  // ดึงข้อมูลทั้งหมด
  getAllTracking(): Observable<{ nodes: any[]; links: any[] }> {
    return this.http.get<WorkflowTracking[]>(this.apiUrl).pipe(
      map((data) => {
        const nodes = [];
        const links = [];

        data.forEach((tracking) => {
          // เพิ่ม Node หากยังไม่มีใน Nodes
          if (!nodes.some((node) => node.id === `${tracking.taskId}`)) {
            nodes.push({ id: `${tracking.taskId}`, label: `${tracking.eventType} (${tracking.status})` });
          }

          // เพิ่ม Link (Source: taskId -> Target: assignmentId)
          if (tracking.assignmentId) {
            links.push({
              source: `${tracking.taskId}`,
              target: `${tracking.assignmentId}`,
              label: `Transaction ID: ${tracking.transactionId}`,
            });
          }
        });

        return { nodes, links };
      })
    );
  }
  /* API ด้านหลัง (Spring Boot) จะคืนค่าข้อมูลในรูปแบบ JSON:
  [
  {
    "trackingId": 1,
    "transactionId": 1001,
    "workflowId": 1,
    "taskId": 10,
    "assignmentId": 20,
    "systemId": 1,
    "eventType": "Start",
    "status": "Pending",
    "timestamp": "2024-12-01T12:00:00",
    "notes": "Workflow started successfully"
  },
  {
    "trackingId": 2,
    "transactionId": 1001,
    "workflowId": 1,
    "taskId": 20,
    "assignmentId": 30,
    "systemId": 1,
    "eventType": "Complete",
    "status": "Completed",
    "timestamp": "2024-12-02T14:00:00",
    "notes": "Task completed"
  }
]

  */
}
