import { OnInit, Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-line-register-selection',
  templateUrl: './register-selection.component.html',
  styleUrls: ['./register-selection.component.scss']
})
export class LineRegisterSelectionComponent implements OnInit {

  @Output() selected = new EventEmitter<string>();

  ngOnInit() {

  }

  onSelect(type) {
    this.selected.emit(type);
  }

}