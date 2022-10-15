import {NestedTreeControl} from '@angular/cdk/tree';
import {Output, Input, Component, EventEmitter, SimpleChanges} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { TreeMenuNode } from './tree-menu-node.model';

@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.css']
})
export class TreeMenuComponent {
  
  selectedNode:string;

  @Input() root: TreeMenuNode[];
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  treeControl = new NestedTreeControl<TreeMenuNode>(node => node.childNodes);
  dataSource = new MatTreeNestedDataSource<TreeMenuNode>();

  constructor() { 
  }

  ngOnInit() {
    this.dataSource.data = this.root;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource.data = this.root;
  }
  
  isSelected(node){
    return (this.selectedNode == JSON.stringify(node.payload)) ? "primary" : "";
  }

  leafClick(node){
    //alert(JSON.stringify(node.payload)); 
    this.selectedNode = JSON.stringify(node.payload);
    this.change.emit(node.payload);
  }
  hasChild = (_: number, node: TreeMenuNode) => !!node.childNodes && node.childNodes.length > 0; 
}
