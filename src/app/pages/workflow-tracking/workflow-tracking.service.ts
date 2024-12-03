import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowTrackingService {

  private baseUrl = 'http://localhost:8080/api/workflows'; // เปลี่ยนเป็น URL ของ API จริง

  constructor(private http: HttpClient) { }

  // ดึงข้อมูล Workflow ทั้งหมด
  getAllWorkflows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // ดึงข้อมูล Transactions ภายใต้ Workflow
  getTransactionsByWorkflow(workflowId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${workflowId}/transactions`);
  }
}
