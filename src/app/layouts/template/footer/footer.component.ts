import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-cmp',
  templateUrl: 'footer.component.html',
  standalone: true,
  imports: [CommonModule]
})

export class FooterComponent {
  test: Date = new Date();
}
