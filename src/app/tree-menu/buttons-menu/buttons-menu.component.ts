import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeMenuNode } from '../tree-menu-node.model';

@Component({
  selector: 'app-buttons-menu',
  templateUrl: './buttons-menu.component.html',
  styleUrls: ['./buttons-menu.component.css']
})
export class ButtonsMenuComponent implements OnInit {

  selectedNode:number=1;

  @Input() root: TreeMenuNode[];
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  dataSource : TreeMenuNode[];
   
  constructor() { }

  ngOnInit() {
  }

  isSelected(node){
    return (this.selectedNode == node.payload.id) ? "primary" : "";
  }

  leafClick(node){
    //alert(JSON.stringify(node.payload)); 
    this.selectedNode = node.payload.id;
    this.change.emit(node.payload);
  }

}
