import {NestedTreeControl} from '@angular/cdk/tree';
import {Output, Input, Component, EventEmitter} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { TreeMenuNode } from './tree-menu-node.model';

@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.css']
})
export class TreeMenuComponent {
  
  selectedNode:number=0;

  @Input() root: TreeMenuNode[];
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  treeControl = new NestedTreeControl<TreeMenuNode>(node => node.childNodes);
  dataSource = new MatTreeNestedDataSource<TreeMenuNode>();

  constructor() { 
  }

  ngOnInit() {
    this.dataSource.data = this.root;
  }

  isSelected(node){
    return (this.selectedNode == node.payload.id) ? "primary" : "";
  }

  leafClick(node){
    //alert(JSON.stringify(node.payload)); 
    this.selectedNode = node.payload.id;
    this.change.emit(node.payload);
  }
  hasChild = (_: number, node: TreeMenuNode) => !!node.childNodes && node.childNodes.length > 0; 
}
