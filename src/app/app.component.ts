import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { Globals } from "./shared/globals";
import { filter, tap } from "rxjs/operators";
import { SharedModule } from "./shared/module/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { Subscription } from "rxjs";
import { WebSocketService } from "./services/web-socket.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [
    SharedModule
    , NgxSpinnerModule
  ]
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private globals: Globals, private webSocketService: WebSocketService) { }

  async ngOnInit() {
    this.initWebsocket();
    await this.globals.init().then((result) => {
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          const body = document.getElementsByTagName("body")[0];
          const modalBackdrop =
            document.getElementsByClassName("modal-backdrop")[0];
          if (body.classList.contains("modal-open")) {
            body.classList.remove("modal-open");
            modalBackdrop.remove();
          }
        })
      );
    });
  }

  initWebsocket() {
    this.webSocketService.listen((message) => {
      console.log('message', message);
    });

    setTimeout(() => {
      this.webSocketService.send({ id: 2, name: 'xxxx' });
    }, 2000);
  }

}
