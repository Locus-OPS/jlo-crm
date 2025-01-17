import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { Subject } from 'rxjs';
import { ApiPageRequest } from 'src/app/model/api-page-request.model';
import { ApiPageResponse } from 'src/app/model/api-page-response.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private rootPath = environment.endpoint;
  private rootPathWebSocket = environment.endpointWebsocket;
  private webSocket: WebSocket | null = null;
  private messages: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient, private api: ApiService) { }

  connect(username: string): void {

    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected.');
      return;
    }
    this.webSocket = new WebSocket(`${this.rootPathWebSocket}?username=${username}`);
    // this.webSocket = new WebSocket(`ws://localhost:8080/jlo-crm-backend/chat?username=${username}`);

    this.webSocket.onmessage = (event: MessageEvent) => {
      console.log('WebSocket message:', event.data);
      this.messages.next(event.data); // ส่งข้อความใหม่เข้าสู่ Subject
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed.');
      this.webSocket = null;
    };
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


  getUserList(params: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/chatweb/getusers', params);
  }

  getChatRoomList(params: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/chatweb/getchatroomlist', params);
  }

  getPrivateChatMessages(params: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/chatweb/getprivatechatmessage', params);
  }

  getPublicChatMessages(params: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/chatweb/getpublicchatmessage', params);
  }

  getChatList(params: ApiPageRequest<any>): Promise<ApiPageResponse<any>> {
    return this.api.call('/api/chatweb/getchatlist', params);
  }


}
