import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { CaseStore } from '../case.store';

@Component({
  selector: 'tab-casekb-content',
  standalone: true,
  imports: [],
  templateUrl: './casekb.component.html',
  styleUrl: './casekb.component.scss'
})
export class CasekbComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    public api: ApiService,
    // private formBuilder: UntypedFormBuilder,
    // private caseacttService: CaseattService,
    public router: Router,
    public globals: Globals,
    // public dialog: MatDialog,
    private caseStore: CaseStore
    // public sanitizer: DomSanitizer,

  ) {
    super(router, globals);
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

  }
}
