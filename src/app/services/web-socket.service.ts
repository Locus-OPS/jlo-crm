import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {

  private connection: CompatClient | undefined = undefined;
  private subscription: StompSubscription | undefined;

  constructor() {
    var socket = new SockJS('http://localhost:8080/jlo-crm-backend/websocket');
    this.connection = Stomp.over(socket);
    this.connection.debug = () => { };
    this.connection.connect({}, () => { });
  }

  public send(param: any): void {
    console.log('this.connection.connected', this.connection.connected);
    if (this.connection && this.connection.connected) {
      this.connection.send('/app/message', {}, JSON.stringify(param));
    }
  }

  public listen(callback: Function): void {
    if (this.connection) {
      console.log('this.connection', this.connection);
      this.connection.connect({}, () => {
        console.log('xxxxxxx');
        this.subscription = this.connection!.subscribe('/topic/public', message => callback(JSON.parse(message.body)));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
