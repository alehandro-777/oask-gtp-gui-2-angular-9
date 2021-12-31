import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  selectedId = 1;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit() {
  }

  btnClicked(id) {
    console.log(JSON.stringify(id));
    this.selectedId = id;
    this.clicked.emit(id);
  }
}
 