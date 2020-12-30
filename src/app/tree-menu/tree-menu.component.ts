import {NestedTreeControl} from '@angular/cdk/tree';
import {Output, Input, Component, EventEmitter} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { TreeMenuHttpService } from './tree-menu.services';

interface TreeMenuNode {
  name: string;
  children?: TreeMenuNode[];
}


@Component({
  selector: 'app-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.css']
})
export class TreeMenuComponent {
  
  @Input() id: string;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  treeControl = new NestedTreeControl<TreeMenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeMenuNode>();

  constructor(private dataService: TreeMenuHttpService) { 
  }

  hasChild = (_: number, node: TreeMenuNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.btnUpdateClick();
  }

  btnUpdateClick(){
    this.dataService.getHttpData(this.id).subscribe(api_result => {
      this.dataSource.data = [api_result];
    });
  }
  leafClick(node){
    //alert(JSON.stringify(node.payload)); 
    this.change.emit(node.payload);
  }
}
