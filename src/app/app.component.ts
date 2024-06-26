import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Globals } from "./shared/globals";
import { filter, tap } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  private _router: Subscription;

  constructor(private router: Router, private globals: Globals) {}

  async ngOnInit() {
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
      // this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      //   const body = document.getElementsByTagName('body')[0];
      //   const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      //   if (body.classList.contains('modal-open')) {
      //     body.classList.remove('modal-open');
      //     modalBackdrop.remove();
      //   }
      // });
    });
  }
}
