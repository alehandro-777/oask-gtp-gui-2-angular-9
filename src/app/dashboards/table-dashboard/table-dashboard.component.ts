import { Component, OnInit } from '@angular/core';
import { TreeMenuNode } from 'src/app/tree-menu/tree-menu-node.model';

import menuCfg from './dash-config.json';

@Component({
  selector: 'app-table-dashboard',
  templateUrl: './table-dashboard.component.html',
  styleUrls: ['./table-dashboard.component.css']
})
export class TableDashboardComponent implements OnInit {

  side_menu: TreeMenuNode[];
  
  constructor() { }

  ngOnInit() {
    this.side_menu = menuCfg;
  }

}
