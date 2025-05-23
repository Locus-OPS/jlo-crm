import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiRequest } from 'src/app/model/api-request.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatExampleService {
  private rootPath = environment.endpoint;
  constructor(private http: HttpClient, private api: ApiService) { }

  private webSocket: WebSocket | null = null;
  private messages: Subject<string> = new Subject<string>();

  connect(username: string): void {

    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected.');
      return;
    }
    this.webSocket = new WebSocket(`wss://jlo.locus.co.th/jlo-crm-backend/chat?username=${username}`);
    //this.webSocket = new WebSocket(`ws://localhost:8080/jlo-crm-backend/chat?username=${username}`);

    this.webSocket.onmessage = (event: MessageEvent) => {
      console.log('WebSocket message:', event.data);
      this.messages.next(event.data); // ส่งข้อความใหม่เข้าสู่ Subject
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed.');
      this.webSocket = null;
    };

    this.webSocket.onerror = (event: Event) => {
      console.log('WebSocket error:', event);
    }
  }

  sendMessage(message: string): void {
    console.log("message ", message);
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  disconnect(): void {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }

  getMessages() {
    return this.messages.asObservable(); // คืนค่า Observable ของข้อความ
  }
}
