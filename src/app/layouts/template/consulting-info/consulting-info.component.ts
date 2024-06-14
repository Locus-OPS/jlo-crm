import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultingService } from 'src/app/pages/consulting/consulting.service';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-consulting-info',
  standalone: false, 
  templateUrl: './consulting-info.component.html',
  styleUrl: './consulting-info.component.scss'
})
export class ConsultingInfoComponent  extends BaseComponent implements OnInit {
  consultingForm : FormGroup;

  constructor( 
    private api: ApiService,
    private formBuilder: FormBuilder,  
    public router: Router, 
    private consulting : ConsultingService,
    private spinner: NgxSpinnerService,
    public globals: Globals) {
    super(router, globals);
  
    }

    ngOnInit() {
      this.consultingForm = this.formBuilder.group({
        consultingNumber: [""],  
        status: [""], 
      });
 
    }
}
