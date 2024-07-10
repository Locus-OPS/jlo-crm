import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent {

}
