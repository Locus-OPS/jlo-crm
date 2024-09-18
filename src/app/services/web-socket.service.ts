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
    try {
      var socket = new SockJS('http://localhost:8080/jlo-crm-backend/message-channel');
      this.connection = Stomp.over(socket);
      this.connection.debug = () => { };
      this.connection.connect({}, () => { });
    } catch (error) {
      console.error('WebSocketService.constructor', error);
    }
  }

  public send(destination: string, param: any): void {
    if (this.connection && this.connection.connected) {
      this.connection.send(destination, {}, JSON.stringify(param));
    }
  }

  public listen(destination: string, callback: Function): void {
    if (this.connection) {
      this.connection.connect({}, () => {
        this.subscription = this.connection!.subscribe(destination, message => callback(JSON.parse(message.body)));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
