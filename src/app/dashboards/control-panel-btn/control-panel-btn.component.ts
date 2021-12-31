import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-control-panel-btn',
  templateUrl: './control-panel-btn.component.html',
  styleUrls: ['./control-panel-btn.component.css']
})
export class ControlPanelBtnComponent implements OnInit {
  
  @Input() id:number=1; 
  @Input() icon:string="list_alt"; 

  @Input() selectedId:number; 

  color:string; 
  disabled:boolean; 

  
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  btnClick(){
    this.clicked.emit(this.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.color =   this.selectedId == this.id ? "primary" : "";
  }
} 
